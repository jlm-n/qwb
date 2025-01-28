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

export const TagsDropdown = memo(({ tags, tagsFilter, onTagsFilterChange }: {
	tags: Record<string, { total: number }>
	tagsFilter: Selection
	onTagsFilterChange: (selection: Selection) => void
}) => (
	<Dropdown>
		<DropdownTrigger className="hidden sm:flex">
			<Button endContent={<IconCaretDownFilled width={16} />}>Tags</Button>
		</DropdownTrigger>
		<DropdownMenu
			disallowEmptySelection
			aria-label="Tags filter"
			closeOnSelect={false}
			selectedKeys={tagsFilter}
			selectionMode="single"
			onSelectionChange={onTagsFilterChange}
		>
			{[
				<DropdownItem showDivider key="all">All</DropdownItem>,
				...Object.keys(tags).sort().map(tag => (
					<DropdownItem key={tag}>{`${tag} (${tags[tag].total})`}</DropdownItem>
				)),
			]}
		</DropdownMenu>
	</Dropdown>
))
