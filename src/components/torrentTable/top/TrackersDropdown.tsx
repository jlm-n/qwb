import type {
	Selection,
} from '@heroui/react'
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@heroui/react'
import { IconCaretDownFilled } from '@tabler/icons-react'
import { memo } from 'react'
import { TorrentTrackerNameCell } from '../cells/TorrentTrackerNameCell'

export const TrackersDropdown = memo(({ trackers, trackerFilter, onTrackerFilterChange }: {
	trackers: Record<string, { total: number }>
	trackerFilter: Selection
	onTrackerFilterChange: (selection: Selection) => void
}) => (
	<Dropdown>
		<DropdownTrigger className="hidden sm:flex">
			<Button endContent={<IconCaretDownFilled width={16} />}>Trackers</Button>
		</DropdownTrigger>
		<DropdownMenu
			disallowEmptySelection
			aria-label="Trackers filter"
			closeOnSelect={false}
			selectedKeys={trackerFilter}
			selectionMode="multiple"
			onSelectionChange={onTrackerFilterChange}
		>
			{Object.keys(trackers).sort().map(tracker => (
				<DropdownItem key={tracker} classNames={{ title: 'space-x-3' }}>
					<TorrentTrackerNameCell trackerUrl={tracker} />
					<span>{`${new URL(tracker).hostname} (${trackers[tracker].total})`}</span>
				</DropdownItem>
			))}
		</DropdownMenu>
	</Dropdown>
))
