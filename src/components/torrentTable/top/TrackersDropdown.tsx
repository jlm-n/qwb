import type {
	Selection,
} from '@nextui-org/react'
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/react'
import { IconCaretDownFilled } from '@tabler/icons-react'
import { memo } from 'react'

export const TrackersDropdown = memo(({
	trackers,
	trackerFilter,
	onTrackerFilterChange,
}: {
	trackers: string[]
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
			{trackers.map(tracker => (
				<DropdownItem key={tracker}>{tracker}</DropdownItem>
			))}
		</DropdownMenu>
	</Dropdown>
))
