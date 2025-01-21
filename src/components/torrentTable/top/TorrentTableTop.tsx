import type { QBittorrentTorrent } from '@/types/QBittorrentTorrent'
import type {
	SelectedItems,
	Selection,
} from '@heroui/react'
import { TorrentAddButton } from '@/components/TorrentAddButton'
import { TorrentContextMenu } from '@/components/TorrentContextMenu'
import { TorrentStatusDropdown } from '@/components/TorrentStatusDropdown'
import {
	ButtonGroup,
	Select,
	SelectItem,
} from '@heroui/react'
import {
	IconArrowNarrowDown,
	IconArrowNarrowUp,
} from '@tabler/icons-react'
import prettyBytes from 'pretty-bytes'
import { memo } from 'react'
import { AppAndServerSettingsButton } from './AppAndServerSettingsButton'
import { CategoriesDropdown } from './CategoriesDropdown'
import { ShowBottomPanelButton } from './ShowBottomPanelButton'
import { TagsDropdown } from './TagsDropdown'
import { TorrentRefreshButtons } from './TorrentRefreshButtons'
import { TorrentSearchInput } from './TorrentSearchInput'
import { TrackersDropdown } from './TrackersDropdown'

const SpeedDisplay = memo(({ speed, total, type }: { speed: number, total: number, type: 'download' | 'upload' }) => (
	<span className="flex text-default-400 text-small min-w-15">
		{type === 'download' ? <IconArrowNarrowDown /> : <IconArrowNarrowUp />}
		{`${prettyBytes(speed || 0)}/s (${prettyBytes(total || 0)})`}
	</span>
))

const RowsPerPageSelect = memo(({ rowsPerPage, onRowsPerPageChange }: { rowsPerPage: string, onRowsPerPageChange: (rowsPerPage: Selection) => void }) => (
	<Select
		key="rows-per-page"
		classNames={{
			base: 'text-default-400 text-small w-fit min-w-32',
			value: 'flex gap-1',
		}}
		aria-label="Rows per page"
		selectedKeys={[rowsPerPage]}
		variant="underlined"
		renderValue={(items: SelectedItems) => (
			<>
				<strong>{items.map(i => i.key).join(',')}</strong>
				<span>per page</span>
			</>
		)}
		onSelectionChange={onRowsPerPageChange}
	>
		<SelectItem key="auto">auto</SelectItem>
		<SelectItem key="5">5</SelectItem>
		<SelectItem key="10">10</SelectItem>
		<SelectItem key="20">20</SelectItem>
		<SelectItem key="30">30</SelectItem>
		<SelectItem key="40">40</SelectItem>
		<SelectItem key="50">50</SelectItem>
		<SelectItem key="70">70</SelectItem>
		<SelectItem key="100">100</SelectItem>
	</Select>
))

export function TorrentTableTop({
	autoRefreshEnabled,
	isRefreshing,
	onAutoRefreshChange,
	onIncrementalTorrentRefresh,
	onRowsPerPageChange,
	onSearchFilterChange,
	onShowBottomPanelChange,
	onStatusFilterChange,
	onTrackerFilterChange,
	onTagFilterChange,
	onCategoryFilterChange,
	rowsPerPage,
	searchFilter,
	selectedTorrentHashes,
	serverDownloadSessionTotal,
	serverDownloadSpeed,
	serverUploadSessionTotal,
	serverUploadSpeed,
	showBottomPanel,
	statusFilter,
	trackerFilter,
	tagFilter,
	categoryFilter,
	trackers,
	categories,
	tags,
	torrents,
}: {
	autoRefreshEnabled: boolean
	isRefreshing: boolean
	onAutoRefreshChange: (autoRefreshEnabled: boolean) => void
	onIncrementalTorrentRefresh: () => void
	onRowsPerPageChange: (rowsPerPage: Selection) => void
	onSearchFilterChange: (searchFilter?: string) => void
	onShowBottomPanelChange: (showBottomPanel: boolean) => void
	onStatusFilterChange: (statusFilter: Selection) => void
	onTrackerFilterChange: (trackerFilter: Selection) => void
	onTagFilterChange: (tagFilter: Selection) => void
	onCategoryFilterChange: (categoryFilter: Selection) => void
	rowsPerPage: string
	searchFilter: string
	selectedTorrentHashes: string[]
	serverDownloadSessionTotal: number
	serverDownloadSpeed: number
	serverUploadSessionTotal: number
	serverUploadSpeed: number
	showBottomPanel: boolean
	statusFilter: Selection
	trackerFilter: Selection
	tagFilter: Selection
	categoryFilter: Selection
	trackers: Record<string, { total: number }>
	categories: Record<string, { total: number }>
	tags: Record<string, { total: number }>
	torrents: Map<string, QBittorrentTorrent>
}) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between gap-3 items-end">
				<TorrentSearchInput searchFilter={searchFilter} onSearchFilterChange={onSearchFilterChange} />
				<div className="flex gap-3">
					<TorrentContextMenu
						torrentHashes={selectedTorrentHashes}
						torrents={torrents}
					/>
					<ButtonGroup>
						<TorrentStatusDropdown
							statusFilter={statusFilter}
							setStatusFilter={onStatusFilterChange}
						/>
						<TrackersDropdown
							trackers={trackers}
							trackerFilter={trackerFilter}
							onTrackerFilterChange={onTrackerFilterChange}
						/>
						<TagsDropdown
							tags={tags}
							tagsFilter={tagFilter}
							onTagsFilterChange={onTagFilterChange}
						/>
						<CategoriesDropdown
							categories={categories}
							categoriesFilter={categoryFilter}
							onCategoriesFilterChange={onCategoryFilterChange}
						/>
					</ButtonGroup>
					<AppAndServerSettingsButton />
					<ButtonGroup>
						<ShowBottomPanelButton
							showBottomPanel={showBottomPanel}
							onShowBottomPanelChange={onShowBottomPanelChange}
						/>
						<TorrentRefreshButtons
							isRefreshing={isRefreshing}
							autoRefreshEnabled={autoRefreshEnabled}
							onIncrementalTorrentRefresh={onIncrementalTorrentRefresh}
							onAutoRefreshChange={onAutoRefreshChange}
						/>
					</ButtonGroup>
					<TorrentAddButton />
				</div>
			</div>
			<div className="flex justify-between items-center">
				<span className="flex gap-2">
					<SpeedDisplay speed={serverDownloadSpeed} total={serverDownloadSessionTotal} type="download" />
					<SpeedDisplay speed={serverUploadSpeed} total={serverUploadSessionTotal} type="upload" />
				</span>
				<span className="flex gap-2 w-fit">
					<RowsPerPageSelect rowsPerPage={rowsPerPage} onRowsPerPageChange={onRowsPerPageChange} />
				</span>
			</div>
		</div>
	)
}
