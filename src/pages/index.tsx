import type { ColumnOption } from '@/types/ColumnOption'
import type { QbittorrentMaindata } from '@/types/QBittorrentMaindata'
import type { QBittorrentServerState } from '@/types/QBittorrentServerState'
import type { QBittorrentTorrent } from '@/types/QBittorrentTorrent'

import type {
	Selection,
	SelectionBehavior,
	SelectionMode,
	SortDescriptor,
} from '@nextui-org/react'
import type {
	KeyboardEvent,
} from 'react'
import { useGetIncrementalMaindata } from '@/api/useGetMaindata'

import { PanelResizeHandle } from '@/components/PanelResizeHandle'
import { TorrentContextMenu } from '@/components/TorrentContextMenu'
import { TorrentDetails } from '@/components/torrentDetails/TorrentDetails'
import { TorrentTableBottom } from '@/components/torrentTable/bottom/TorrentTableBottom'
import { renderCell } from '@/components/torrentTable/cells/renderCells'
import { searchNormalize } from '@/components/torrentTable/normalizeTorrentName'
import { sortAndFilterTorrents } from '@/components/torrentTable/sortAndFilterTorrents'
import { TorrentTableTop } from '@/components/torrentTable/top/TorrentTableTop'
import { TORRENT_TABLE_COLUMNS } from '@/components/torrentTable/TorrentTableColumns'
import { usePersistentState } from '@/hooks/usePersistentState'
import { useTorrentListRefreshRate } from '@/hooks/useTorrentListRefreshRate'
import { useVisibleColumns } from '@/hooks/useVisibleColumns'
import {
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from '@nextui-org/react'
import {
	startTransition,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { useNavigate } from 'react-router-dom'

const TORRENTS = new Map<string, QBittorrentTorrent>()

async function mergeMaindata(updatedMaindata: QbittorrentMaindata): Promise<{
	rid: number
	serverState: QBittorrentServerState
	torrents: QBittorrentTorrent[]
	trackers: Record<string, string[]>
}> {
	const r = updatedMaindata

	for (const hash in r.torrents) {
		const torrent = r.torrents[hash]
		const existing = TORRENTS.get(hash) || { name: '' }

		TORRENTS.set(hash, {
			...existing,
			...torrent,
			hash,
			normalized_name: searchNormalize(existing.name || torrent.name || ''),
		})
	}

	for (const hash of r.torrents_removed || []) {
		TORRENTS.delete(hash)
	}

	for (const tracker in r.trackers) {
		for (const torrentHash of r.trackers[tracker]) {
			const existing = TORRENTS.get(torrentHash)

			if (!existing) {
				continue
			}

			TORRENTS.set(torrentHash, {
				...existing,
				tracker,
			})
		}
	}

	return {
		rid: r.rid,
		serverState: r.server_state,
		torrents: Array.from(TORRENTS.values()),
		trackers: r.trackers,
	}
}

export default function App() {
	const navigate = useNavigate()
	const [filterValue, setFilterValue] = useState('')
	const [selectedTorrents, setSelectedTorrents] = useState<Selection>(new Set())
	const [visibleColumns] = useVisibleColumns()
	const [refreshInterval] = useTorrentListRefreshRate()
	const [statusFilterValue, setStatusFilter] = useState<Selection>(new Set(['all']))
	const [rowsPerPage, setRowsPerPage] = usePersistentState('rowsPerPage', 20)
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: 'added_on', direction: 'descending' })
	const [serverState, setServerState] = useState<QBittorrentServerState>({})
	const [trackers, setTrackers] = useState<Array<string>>([])
	const [trackerFilterValue, setTrackerFilter] = useState<Selection>('all')
	const [autoRefreshEnabled, setAutoRefreshEnabled] = usePersistentState('autoRefresh', true)
	const [selectionMode, setSelectionMode] = useState<SelectionMode>('single')
	const [selectionBehaviour, setSelectionBehaviour] = useState<SelectionBehavior>('replace')
	const [showBottomPanel, setShowBottomPanel] = usePersistentState('showBottomPanel', false)
	const [pages, setPages] = useState(1)
	const [page, setPage] = useState(1)

	const headerColumns = useMemo(() => {
		if (visibleColumns === 'all') {
			return TORRENT_TABLE_COLUMNS
		}
		return TORRENT_TABLE_COLUMNS.filter(column =>
			visibleColumns.has(column.uid),
		)
	}, [visibleColumns])

	const onRowsPerPageChange = useCallback((value: Selection) => {
		if (value === 'all') {
			// we don't support this value.
			return
		}
		setRowsPerPage(Number(value.values().next().value))
		setPage(1)
	}, [setPage, setRowsPerPage])

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setFilterValue(value)
		}
		else {
			setFilterValue('')
		}
		setPage(1)
	}, [])

	const [items, setItems] = useState<QBittorrentTorrent[]>([])
	const [filteredItemsLength, setFilteredItemsLength] = useState(0)

	const sortAndFilterTorrentsCallback = useCallback(
		(torrents: QBittorrentTorrent[] = Array.from(TORRENTS.values())) => {
			startTransition(() => {
				const { pagedTorrents, filteredTorrentLength, pages }
					= sortAndFilterTorrents(
						torrents,
						filterValue,
						statusFilterValue,
						trackerFilterValue,
						sortDescriptor,
						rowsPerPage,
						page,
					)
				setFilteredItemsLength(filteredTorrentLength)
				setPages(pages)
				setItems(pagedTorrents)
			})
		},
		[
			filterValue,
			statusFilterValue,
			trackerFilterValue,
			sortDescriptor,
			rowsPerPage,
			page,
			setFilteredItemsLength,
			setPages,
			setItems,
		],
	)

	const [getIncrementalMaindata, isLoading, getIncrementalMaindataError, rid] = useGetIncrementalMaindata()
	const getIncrementalMaindataCallback = useCallback(async () => {
		const updatedMaindata = await getIncrementalMaindata()
		const {
			torrents,
			trackers: newTrackers,
			serverState,
		} = await mergeMaindata(updatedMaindata)
		if (newTrackers) {
			setTrackers(
				Object.keys(newTrackers).map(tracker => new URL(tracker).hostname),
			)
		}
		setServerState(oldServerState => ({ ...oldServerState, ...serverState }))
		sortAndFilterTorrentsCallback(torrents)
	}, [getIncrementalMaindata, setTrackers, setServerState, sortAndFilterTorrentsCallback])

	useEffect(() => {
		if (getIncrementalMaindataError) {
			navigate('/login')
		}
	}, [getIncrementalMaindataError, navigate])

	useEffect(() => {
		sortAndFilterTorrentsCallback()
	}, [
		sortAndFilterTorrentsCallback,
		filterValue,
		statusFilterValue,
		trackerFilterValue,
		sortDescriptor,
		rowsPerPage,
		page,
	])

	useEffect(() => {
		if (autoRefreshEnabled) {
			const timeout = setTimeout(
				getIncrementalMaindataCallback,
				refreshInterval,
			)
			return () => clearTimeout(timeout)
		}
	}, [getIncrementalMaindataCallback, refreshInterval, autoRefreshEnabled, rid, page, statusFilterValue, filterValue, trackerFilterValue, items])

	const selectedTorrentHash = useMemo(() => {
		if (selectedTorrents === 'all' || selectedTorrents.size !== 1) {
			return undefined
		}
		return selectedTorrents.values().next().value as string | undefined
	}, [selectedTorrents])

	const handleKeyEvent = useCallback(
		(event: KeyboardEvent<HTMLTableElement>) => {
			const elementDataRole = document.activeElement?.attributes.getNamedItem('data-role')?.value
			if (elementDataRole !== 'torrent-table-row') {
				return
			}

			const isMetaKey = event.code.includes('Meta') || event.code.includes('Control') || event.code.includes('Shift')
			if (isMetaKey && event.type === 'keydown') {
				setSelectionMode('multiple')
				setSelectionBehaviour('toggle')
			}
			if (isMetaKey && event.type === 'keyup') {
				setSelectionMode('single')
				setSelectionBehaviour('replace')
			}
		},
		[setSelectionMode, setSelectionBehaviour],
	)

	const selectedTorrentHashes = useMemo(() => {
		return selectedTorrents === 'all'
			? items.map(item => item.hash)
			: (Array.from(selectedTorrents) as string[])
	}, [items, selectedTorrents])

	const [constextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number } | undefined>(undefined)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const onContextMenuCallback = useCallback((torrentHash: string, x: number, y: number) => {
		setContextMenuPosition({ x, y })
		setSelectedTorrents(new Set([torrentHash]))
		onOpen()
	}, [setSelectedTorrents, onOpen])

	return (
		<>
			<PanelGroup
				direction="vertical"
				className="!min-h-screen !h-screen w-screen"
			>
				<Panel className={showBottomPanel ? '' : 'h-full'} minSize={30}>
					<Table
						isHeaderSticky
						aria-label="Torrent list"
						classNames={{
							base: 'h-full p-3',
							wrapper: 'h-full',
						}}
						isStriped
						isVirtualized
						color="primary"
						selectedKeys={selectedTorrents}
						selectionMode={selectionMode}
						selectionBehavior={selectionBehaviour}
						sortDescriptor={sortDescriptor}
						bottomContentPlacement="outside"
						bottomContent={<TorrentTableBottom selectedTorrents={selectedTorrents} filteredItemsLength={filteredItemsLength} onPageChange={setPage} page={page} pages={pages} />}
						topContentPlacement="outside"
						topContent={(
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
								searchFilter={filterValue}
								selectedTorrentHashes={selectedTorrentHashes}
								serverDownloadSessionTotal={serverState.dl_info_data || 0}
								serverDownloadSpeed={serverState.dl_info_speed || 0}
								serverUploadSessionTotal={serverState.up_info_data || 0}
								serverUploadSpeed={serverState.up_info_speed || 0}
								showBottomPanel={showBottomPanel}
								statusFilter={statusFilterValue}
								trackerFilter={trackerFilterValue}
								trackers={trackers}
								torrents={TORRENTS}
							/>
						)}
						onSelectionChange={setSelectedTorrents}
						onSortChange={setSortDescriptor}
						onKeyDown={handleKeyEvent}
						onKeyUp={handleKeyEvent}
					>
						<TableHeader columns={headerColumns}>
							{(column: ColumnOption) => (
								<TableColumn
									key={column.uid}
									align={
										['actions', 'state'].includes(column.uid) ? 'center' : 'start'
									}
									allowsSorting={'sortable' in column ? column.sortable : false}
									hideHeader={column.hideHeader}
									maxWidth={column.uid === 'tracker' ? 80 : undefined}
									width={column.width}
								>
									{column.name}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody
							isLoading={isLoading && !items.length}
							items={items}
							loadingContent={<Spinner />}
						>
							{item => (
								<TableRow
									key={item.hash}
									data-role="torrent-table-row"
									aria-roledescription="torrent table row"
									onContextMenu={(e) => {
										e.preventDefault()
										onContextMenuCallback(item.hash, e.clientX, e.clientY)
									}}
								>
									{columnKey => (
										<TableCell data-role="torrent-table-cell" className="text-nowrap">
											{renderCell(
												columnKey as (typeof TORRENT_TABLE_COLUMNS)[number]['uid'],
												item[columnKey as keyof QBittorrentTorrent],
												item.state,
												item.num_complete,
												item.num_incomplete,
												item && (!item.tags || !item.tags.includes('seed')),
											)}
										</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
				</Panel>
				{showBottomPanel && selectedTorrentHashes?.length === 1 && (
					<>
						<PanelResizeHandle />
						<Panel minSize={30} defaultSize={30} className="overflow-auto">
							<TorrentDetails torrentHash={selectedTorrentHash} />
						</Panel>
					</>
				)}
			</PanelGroup>
			<TorrentContextMenu isOpen={isOpen} onClose={onClose} torrentHashes={selectedTorrentHashes} torrents={TORRENTS} position={constextMenuPosition} />
		</>
	)
}
