import type { ColumnOption } from '@/types/ColumnOption'
import type { QBittorrentServerState } from '@/types/QBittorrentServerState'
import type { QBittorrentTorrent } from '@/types/QBittorrentTorrent'

import type { Selection, SelectionMode, SortDescriptor } from '@heroui/react'

import { useGetIncrementalMaindata } from '@/api/useGetMaindata'

import { PanelResizeHandle } from '@/components/PanelResizeHandle'
import { TorrentContextMenu } from '@/components/torrentContextMenu/TorrentContextMenu'
import { TorrentDetails } from '@/components/torrentDetails/TorrentDetails'
import { TORRENT_TABLE_COLUMNS } from '@/components/torrentTable/TorrentTableColumns'
import { TorrentTableBottom } from '@/components/torrentTable/bottom/TorrentTableBottom'
import { renderCell } from '@/components/torrentTable/cells/renderCells'
import { sortAndFilterTorrents } from '@/components/torrentTable/sortAndFilterTorrents'
import { TorrentTableTop } from '@/components/torrentTable/top/TorrentTableTop'
import { useInterval } from '@/hooks/useInterval'
import { usePersistentState } from '@/hooks/usePersistentState'

import { useQBittorrentMaindata } from '@/hooks/useQBittorrentMaindata'
import { useSettings } from '@/hooks/useSettings'
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@heroui/react'
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { useNavigate } from 'react-router-dom'

export function IndexPage() {
	const navigate = useNavigate()
	const { visibleColumns, torrentListRefreshRate } = useSettings()
	const { TORRENTS, mergeMaindata } = useQBittorrentMaindata()

	const [trackers, setTrackers] = useState<Record<string, { total: number }>>({})
	const [trackerFilter, setTrackerFilter] = useState<Selection>('all')
	const [categories, setCategories] = useState<Record<string, { total: number }>>({})
	const [categoryFilter, setCategoryFilter] = useState<Selection>(new Set(['all']))
	const [tags, setTags] = useState<Record<string, { total: number }>>({})
	const [tagFilter, setTagFilter] = useState<Selection>(new Set(['all']))
	const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['all']))
	const [searchFilter, setSearchFilter] = useState('')
	const [selectedTorrents, setSelectedTorrents] = useState<Selection>(new Set())
	const [rowsPerPage, setRowsPerPage] = usePersistentState('rowsPerPage', '20')
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: 'added_on',
		direction: 'descending',
	})
	const [serverState, setServerState] = useState<QBittorrentServerState>({})
	const [autoRefreshEnabled, setAutoRefreshEnabled] = usePersistentState('autoRefresh', true)
	const [showBottomPanel, setShowBottomPanel] = usePersistentState('showBottomPanel', false)
	const [pages, setPages] = useState(1)
	const [page, setPage] = useState(1)
	const [selectionMode, setSelectionMode] = usePersistentState<SelectionMode>('selectionMode', 'multiple')
	const torrentTableRef = useRef<HTMLTableElement>(null)

	const headerColumns = useMemo(() => {
		if (visibleColumns === 'all') {
			return TORRENT_TABLE_COLUMNS
		}
		return TORRENT_TABLE_COLUMNS.filter((column) => visibleColumns.has(column.uid))
	}, [visibleColumns])

	const onRowsPerPageChange = useCallback(
		(value: Selection) => {
			if (value === 'all') {
				// we don't support this value.
				return
			}
			setRowsPerPage(String(value.values().next().value))
			setPage(1)
		},
		[setRowsPerPage]
	)

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setSearchFilter(value)
		} else {
			setSearchFilter('')
		}
		setPage(1)
	}, [])

	const [items, setItems] = useState<QBittorrentTorrent[]>([])
	const [filteredItemsLength, setFilteredItemsLength] = useState(0)

	const sortAndFilterTorrentsCallback = useCallback(
		(torrents: QBittorrentTorrent[] = Array.from(TORRENTS.values())) => {
			startTransition(() => {
				const tableContainerHeight = (torrentTableRef.current?.parentNode as HTMLDivElement)?.clientHeight
				const {
					pagedTorrents,
					totalTorrentsCount: filteredTorrentLength,
					pagesCount: pages,
				} = sortAndFilterTorrents(
					torrents,
					searchFilter,
					statusFilter,
					trackerFilter,
					tagFilter,
					categoryFilter,
					sortDescriptor,
					rowsPerPage === 'auto' ? Math.floor((tableContainerHeight - 72) / 40) : +rowsPerPage, //  remove the header size and divide by the average row height
					page
				)
				setFilteredItemsLength(filteredTorrentLength)
				setPages(pages)
				setItems(pagedTorrents)
			})
		},
		[searchFilter, statusFilter, trackerFilter, tagFilter, categoryFilter, sortDescriptor, rowsPerPage, page, TORRENTS]
	)

	const [getIncrementalMaindata, isLoading, getIncrementalMaindataError] = useGetIncrementalMaindata()
	const getIncrementalMaindataCallback = useCallback(async () => {
		const updatedMaindata = await getIncrementalMaindata()
		const { torrents, trackers, categories, tags, serverState } = mergeMaindata(updatedMaindata)
		setCategories(categories)
		setTags(tags)
		setTrackers(trackers)
		setServerState((oldServerState) => ({ ...oldServerState, ...serverState }))
		sortAndFilterTorrentsCallback(torrents)
	}, [getIncrementalMaindata, sortAndFilterTorrentsCallback, mergeMaindata])

	useEffect(() => {
		if (getIncrementalMaindataError) {
			navigate('/login')
		}
	}, [getIncrementalMaindataError, navigate])

	useEffect(() => {
		sortAndFilterTorrentsCallback()
	}, [sortAndFilterTorrentsCallback])

	useInterval(getIncrementalMaindataCallback, autoRefreshEnabled ? torrentListRefreshRate : null)

	const selectedTorrentHash = useMemo(() => {
		if (selectedTorrents === 'all' || selectedTorrents.size !== 1) {
			return undefined
		}
		return selectedTorrents.values().next().value as string | undefined
	}, [selectedTorrents])

	const selectedTorrentHashes = useMemo(() => {
		return selectedTorrents === 'all' ? items.map((item) => item.hash) : (Array.from(selectedTorrents) as string[])
	}, [items, selectedTorrents])

	const triggerRef = useRef<HTMLElement | null>(null)
	const [constextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | undefined>(undefined)
	const { isOpen, onOpen: openContextMenu, onClose: closeContextMenu } = useDisclosure()
	const onContextMenuCallback = (torrentHash: string, target: HTMLElement, x: number, y: number) => {
		triggerRef.current = target ?? null
		setContextMenuPosition({ x, y })
		if (selectedTorrents !== 'all' && !selectedTorrents.has(torrentHash)) {
			setSelectedTorrents(new Set([torrentHash]))
		}
		openContextMenu()
	}

	return (
		<>
			<PanelGroup direction="vertical" className="!min-h-screen !h-screen w-screen">
				<Panel id="main-panel" order={1} className={`flex flex-col p-3 ${showBottomPanel ? '' : 'h-full'}`} minSize={30}>
					<TorrentTableTop
						autoRefreshEnabled={autoRefreshEnabled}
						isRefreshing={isLoading}
						onAutoRefreshChange={setAutoRefreshEnabled}
						onIncrementalTorrentRefresh={getIncrementalMaindataCallback}
						onRowsPerPageChange={onRowsPerPageChange}
						onSearchFilterChange={onSearchChange}
						onShowBottomPanelChange={setShowBottomPanel}
						onStatusFilterChange={setStatusFilter}
						onTrackerFilterChange={setTrackerFilter}
						rowsPerPage={rowsPerPage}
						searchFilter={searchFilter}
						selectedTorrentHashes={selectedTorrentHashes}
						serverDownloadSessionTotal={serverState.dl_info_data || 0}
						serverDownloadSpeed={serverState.dl_info_speed || 0}
						serverUploadSessionTotal={serverState.up_info_data || 0}
						serverUploadSpeed={serverState.up_info_speed || 0}
						showBottomPanel={showBottomPanel}
						statusFilter={statusFilter}
						trackers={trackers}
						trackerFilter={trackerFilter}
						categories={categories}
						categoryFilter={categoryFilter}
						onCategoryFilterChange={setCategoryFilter}
						tags={tags}
						tagFilter={tagFilter}
						onTagFilterChange={setTagFilter}
						torrents={TORRENTS}
						selectionMode={selectionMode}
						onSelectionModeChange={setSelectionMode}
					/>
					<Table
						isHeaderSticky={true}
						ref={torrentTableRef}
						aria-label="Torrent list"
						classNames={{
							base: 'flex-1 min-h-0 p-3',
							wrapper: '!h-full',
						}}
						isStriped={true}
						isVirtualized={true}
						color="primary"
						selectedKeys={selectedTorrents}
						selectionMode={selectionMode}
						selectionBehavior="toggle"
						sortDescriptor={sortDescriptor}
						onSelectionChange={setSelectedTorrents}
						onSortChange={setSortDescriptor}
					>
						<TableHeader columns={headerColumns}>
							{(column: ColumnOption) => (
								<TableColumn
									key={column.uid}
									align={['actions', 'state'].includes(column.uid) ? 'center' : 'start'}
									allowsSorting={'sortable' in column ? column.sortable : false}
									hideHeader={column.hideHeader}
									maxWidth={column.uid === 'tracker' ? 80 : undefined}
									width={column.width}
								>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody isLoading={isLoading && items.length === 0} items={items} loadingContent={<Spinner />}>
							{(item) => (
								<TableRow
									key={item.hash}
									data-role="torrent-table-row"
									aria-roledescription="torrent table row"
									onContextMenu={(e) => {
										e.preventDefault()
										onContextMenuCallback(item.hash, e.currentTarget, e.clientX, e.clientY)
									}}
								>
									{(columnKey) => (
										<TableCell data-role="torrent-table-cell" className="text-nowrap">
											{renderCell(columnKey as (typeof TORRENT_TABLE_COLUMNS)[number]['uid'], item[columnKey as keyof QBittorrentTorrent], item.state, item.num_complete, item.num_incomplete, !(item.tags || '').includes('seed'))}
										</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
					<TorrentTableBottom selectedTorrents={selectedTorrents} filteredItemsLength={filteredItemsLength} onPageChange={setPage} page={page} pages={pages} />
				</Panel>
				{showBottomPanel && (
					<>
						<PanelResizeHandle />
						<Panel id="details-panel" order={2} minSize={30} defaultSize={30}>
							<TorrentDetails torrentHash={selectedTorrentHash} />
						</Panel>
					</>
				)}
			</PanelGroup>
			<TorrentContextMenu isOpen={isOpen} onClose={closeContextMenu} triggerRef={triggerRef} torrentHashes={selectedTorrentHashes} torrents={TORRENTS} tags={Object.keys(tags)} position={constextMenuPosition} />
		</>
	)
}
