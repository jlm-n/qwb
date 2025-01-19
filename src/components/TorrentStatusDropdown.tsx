import type { QBittorrentTorrentState } from '@/types/QBittorrentTorrentState'
import type {
	Selection,
} from '@heroui/react'
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from '@heroui/react'
import { IconCaretDownFilled } from '@tabler/icons-react'
import { memo } from 'react'
import { QBittorrentStateIcon } from './icons/QBittorrentStateIcon'

interface StatusSectionDefinition { label: string, value: QBittorrentTorrentState | 'all', icon: React.ReactNode }
type StatusSection = Array<StatusSectionDefinition>
const items: Array<StatusSection> = [
	[{ label: 'All', value: 'all', icon: null }],
	[
		{ label: 'Allocating', value: 'allocating', icon: <QBittorrentStateIcon state="allocating" /> },
		{ label: 'Checking Resume Data', value: 'checkingResumeData', icon: <QBittorrentStateIcon state="checkingResumeData" /> },
		{ label: 'Error', value: 'error', icon: <QBittorrentStateIcon state="error" /> },
		{ label: 'Metadata', value: 'metaDL', icon: <QBittorrentStateIcon state="metaDL" /> },
		{ label: 'Missing Files', value: 'missingFiles', icon: <QBittorrentStateIcon state="missingFiles" /> },
		{ label: 'Moving', value: 'moving', icon: <QBittorrentStateIcon state="moving" /> },
		{ label: 'Unknown', value: 'unknown', icon: <QBittorrentStateIcon state="unknown" /> },
	],
	[
		{ label: 'Downloading', value: 'downloading', icon: <QBittorrentStateIcon state="downloading" /> },
		{ label: 'Stalled', value: 'stalledDL', icon: <QBittorrentStateIcon state="stalledDL" /> },
		{ label: 'Forced', value: 'forcedDL', icon: <QBittorrentStateIcon state="forcedDL" /> },
		{ label: 'Queued', value: 'queuedDL', icon: <QBittorrentStateIcon state="queuedDL" /> },
		{ label: 'Paused', value: 'pausedDL', icon: <QBittorrentStateIcon state="pausedDL" /> },
		{ label: 'Checking', value: 'checkingDL', icon: <QBittorrentStateIcon state="checkingDL" /> },
		{ label: 'Stopped', value: 'stoppedDL', icon: <QBittorrentStateIcon state="stoppedDL" /> },
	],
	[
		{ label: 'Uploading', value: 'uploading', icon: <QBittorrentStateIcon state="uploading" /> },
		{ label: 'Stalled', value: 'stalledUP', icon: <QBittorrentStateIcon state="stalledUP" /> },
		{ label: 'Forced', value: 'forcedUP', icon: <QBittorrentStateIcon state="forcedUP" /> },
		{ label: 'Queued', value: 'queuedUP', icon: <QBittorrentStateIcon state="queuedUP" /> },
		{ label: 'Paused', value: 'pausedUP', icon: <QBittorrentStateIcon state="pausedUP" /> },
		{ label: 'Checking', value: 'checkingUP', icon: <QBittorrentStateIcon state="checkingUP" /> },
		{ label: 'Stopped', value: 'stoppedUP', icon: <QBittorrentStateIcon state="stoppedUP" /> },
	],
]

export const TorrentStatusDropdown = memo(({
	statusFilter,
	setStatusFilter,
}: {
	statusFilter: Selection
	setStatusFilter: (statusFilter: Selection) => void
}) => (
	<Dropdown>
		<DropdownTrigger className="hidden sm:flex">
			<Button endContent={<IconCaretDownFilled width={16} />}>Status</Button>
		</DropdownTrigger>
		<DropdownMenu
			disallowEmptySelection
			aria-label="Torrent status filter"
			closeOnSelect={false}
			selectedKeys={statusFilter}
			selectionMode="single"
			onSelectionChange={setStatusFilter}
		>
			{items.map((section, index) => (
				<DropdownSection
					classNames={{
						base: 'last:mb-0',
					}}
					// eslint-disable-next-line react/no-array-index-key
					key={`section-${index}`}
					showDivider={index < items.length - 1}
				>
					{section.map(item => (
						<DropdownItem
							key={item.value}
							startContent={item.icon}
						>
							{item.label}
						</DropdownItem>
					))}
				</DropdownSection>
			))}
		</DropdownMenu>
	</Dropdown>
))
