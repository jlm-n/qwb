import type { ColumnOption } from '@/types/ColumnOption'
import type { QBittorrentMaindata } from '@/types/QBittorrentMaindata'
import type { QBittorrentServerState } from '@/types/QBittorrentServerState'
import type { QBittorrentTorrent } from '@/types/QBittorrentTorrent'

import type {
	Selection,
	SortDescriptor,
} from '@heroui/react'

import { useGetIncrementalMaindata } from '@/api/useGetMaindata'

import { PanelResizeHandle } from '@/components/PanelResizeHandle'
import { TorrentContextMenu } from '@/components/torrentContextMenu/TorrentContextMenu'
import { TorrentDetails } from '@/components/torrentDetails/TorrentDetails'
import { TorrentTableBottom } from '@/components/torrentTable/bottom/TorrentTableBottom'
import { renderCell } from '@/components/torrentTable/cells/renderCells'
import { normalizeForSearch } from '@/components/torrentTable/normalizeTorrentName'
import { normalizeTorrentPriority } from '@/components/torrentTable/normalizeTorrentPriority'
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
} from '@heroui/react'
import {
	startTransition,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { useNavigate } from 'react-router-dom'

const TORRENTS = new Map<string, QBittorrentTorrent>()
const SERVER_STATE: QBittorrentServerState = {}
const CATEGORIES: Record<string, { total: number }> = {}
const TAGS: Record<string, { total: number }> = {}

async function mergeMaindata(r: QBittorrentMaindata): Promise<{
	serverState: QBittorrentServerState
	torrents: QBittorrentTorrent[]
	trackers: Record<string, { total: number }>
	categories: Record<string, { total: number }>
	tags: Record<string, { total: number }>
}> {
	// Process torrents & update cache
	for (const hash in r.torrents) {
		const torrent = r.torrents[hash]
		const existing = TORRENTS.get(hash) || { name: '', priority: undefined, tags: '' }

		TORRENTS.set(hash, {
			...existing,
			...torrent,
			hash,
			// extra computed fields
			normalized_name: normalizeForSearch(existing.name || torrent.name || ''),
			normalized_priority: normalizeTorrentPriority(existing.priority ?? torrent.priority),
			normalized_tags: (existing.tags || torrent.tags || '').split(',').map(t => t.trim()).filter(t => !!t),
		})
	}

	// Delete removed torrents
	for (const hash of r.torrents_removed || []) {
		TORRENTS.delete(hash)
	}

	// Fix the torrent tracker information
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

	// Setup initial tags & categories
	for (const tag of (r.tags || [])) {
		TAGS[tag] = { total: 0 }
	}
	for (const tag of (r.tags_removed || [])) {
		delete TAGS[tag]
	}
	for (const category of Object.keys(r.categories || {})) {
		if (!CATEGORIES[category]) {
			CATEGORIES[category] = { total: 0 }
		}
	}

	// Compute tracker, tags & categories stats
	const torrents = Array.from(TORRENTS.values())
	const trackers: Record<string, { total: number }> = {}
	const tags: Record<string, { total: number }> = {}
	const categories: Record<string, { total: number }> = {}
	for (const torrent of torrents) {
		if (torrent.tracker) {
			if (!trackers[torrent.tracker]) {
				trackers[torrent.tracker] = { total: 0 }
			}
			trackers[torrent.tracker].total += 1
		}
		for (const tag of torrent.normalized_tags) {
			if (!tags[tag]) {
				tags[tag] = { total: 0 }
			}
			tags[tag].total += 1
		}
		if (torrent.category) {
			if (!categories[torrent.category]) {
				categories[torrent.category] = { total: 0 }
			}
			categories[torrent.category].total += 1
		}
	}

	return {
		serverState: Object.assign(SERVER_STATE, r.server_state || {}),
		torrents,
		trackers,
		categories: Object.assign(CATEGORIES, categories),
		tags: Object.assign(TAGS, tags),
	}
}

export default function App() {
	const navigate = useNavigate()

	const [trackers, setTrackers] = useState<Record<string, { total: number }>>({})
	const [trackerFilter, setTrackerFilter] = useState<Selection>('all')
	const [categories, setCategories] = useState<Record<string, { total: number }>>({})
	const [categoryFilter, setCategoryFilter] = useState<Selection>(new Set(['all']))
	const [tags, setTags] = useState<Record<string, { total: number }>>({})
	const [tagFilter, setTagFilter] = useState<Selection>(new Set(['all']))
	const [statusFilter, setStatusFilter] = useState<Selection>(new Set(['all']))
	const [searchFilter, setSearchFilter] = useState('')
	const [selectedTorrents, setSelectedTorrents] = useState<Selection>(new Set())
	const [visibleColumns] = useVisibleColumns()
	const [refreshInterval] = useTorrentListRefreshRate()
	const [rowsPerPage, setRowsPerPage] = usePersistentState('rowsPerPage', '20')
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: 'added_on', direction: 'descending' })
	const [serverState, setServerState] = useState<QBittorrentServerState>({})
	const [autoRefreshEnabled, setAutoRefreshEnabled] = usePersistentState('autoRefresh', true)
	const [showBottomPanel, setShowBottomPanel] = usePersistentState('showBottomPanel', false)
	const [pages, setPages] = useState(1)
	const [page, setPage] = useState(1)
	const torrentTableRef = useRef<HTMLTableElement>(null)

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
		setRowsPerPage(String(value.values().next().value))
		setPage(1)
	}, [setPage, setRowsPerPage])

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setSearchFilter(value)
		}
		else {
			setSearchFilter('')
		}
		setPage(1)
	}, [])

	const [items, setItems] = useState<QBittorrentTorrent[]>([])
	const [filteredItemsLength, setFilteredItemsLength] = useState(0)

	const sortAndFilterTorrentsCallback = useCallback(
		(torrents: QBittorrentTorrent[] = Array.from(TORRENTS.values())) => {
			startTransition(() => {
				const tableContainerHeight = ((torrentTableRef.current?.parentNode as HTMLDivElement)?.clientHeight)
				const { pagedTorrents, totalTorrentsCount: filteredTorrentLength, pagesCount: pages }
					= sortAndFilterTorrents(
						torrents,
						searchFilter,
						statusFilter,
						trackerFilter,
						tagFilter,
						categoryFilter,
						sortDescriptor,
						rowsPerPage === 'auto' ? Math.floor((tableContainerHeight - 72) / 40) : +rowsPerPage, //  remove the header size and divide by the average row height
						page,
					)
				setFilteredItemsLength(filteredTorrentLength)
				setPages(pages)
				setItems(pagedTorrents)
			})
		},
		[
			searchFilter,
			statusFilter,
			trackerFilter,
			tagFilter,
			categoryFilter,
			sortDescriptor,
			rowsPerPage,
			page,
			setFilteredItemsLength,
			setPages,
			setItems,
			torrentTableRef,
		],
	)

	const [getIncrementalMaindata, isLoading, getIncrementalMaindataError, rid] = useGetIncrementalMaindata()
	const getIncrementalMaindataCallback = useCallback(async () => {
		const updatedMaindata = await getIncrementalMaindata()
		const {
			torrents,
			trackers,
			categories,
			tags,
			serverState,
		} = await mergeMaindata(updatedMaindata)
		setCategories(categories)
		setTags(tags)
		setTrackers(trackers)
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
		searchFilter,
		statusFilter,
		trackerFilter,
		tagFilter,
		categoryFilter,
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
	}, [getIncrementalMaindataCallback, refreshInterval, autoRefreshEnabled, rid, page, statusFilter, searchFilter, trackerFilter, items])

	const selectedTorrentHash = useMemo(() => {
		if (selectedTorrents === 'all' || selectedTorrents.size !== 1) {
			return undefined
		}
		return selectedTorrents.values().next().value as string | undefined
	}, [selectedTorrents])

	const selectedTorrentHashes = useMemo(() => {
		return selectedTorrents === 'all'
			? items.map(item => item.hash)
			: (Array.from(selectedTorrents) as string[])
	}, [items, selectedTorrents])

	const triggerRef = useRef<HTMLElement | null>(null)
	const [constextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number } | undefined>(undefined)
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
			<PanelGroup
				direction="vertical"
				className="!min-h-screen !h-screen w-screen"
			>
				<Panel className={`flex flex-col p-3 ${showBottomPanel ? '' : 'h-full'}`} minSize={30}>
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
					/>
					<Table
						isHeaderSticky
						ref={torrentTableRef}
						aria-label="Torrent list"
						classNames={{
							base: 'grow',
							wrapper: 'h-full',
						}}
						isCompact
						isStriped
						// isVirtualized
						color="primary"
						selectedKeys={selectedTorrents}
						selectionMode="single"
						selectionBehavior="replace"
						sortDescriptor={sortDescriptor}
						onSelectionChange={setSelectedTorrents}
						onSortChange={setSortDescriptor}
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
										onContextMenuCallback(item.hash, e.currentTarget, e.clientX, e.clientY)
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
					<TorrentTableBottom selectedTorrents={selectedTorrents} filteredItemsLength={filteredItemsLength} onPageChange={setPage} page={page} pages={pages} />
				</Panel>
				{showBottomPanel && (
					<>
						<PanelResizeHandle />
						<Panel minSize={30} defaultSize={30}>
							<TorrentDetails torrentHash={selectedTorrentHash} />
						</Panel>
					</>
				)}
			</PanelGroup>
			<TorrentContextMenu
				isOpen={isOpen}
				onClose={closeContextMenu}
				triggerRef={triggerRef}
				torrentHashes={selectedTorrentHashes}
				torrents={TORRENTS}
				tags={Object.keys(tags)}
				position={constextMenuPosition}
			/>
		</>
	)
}
