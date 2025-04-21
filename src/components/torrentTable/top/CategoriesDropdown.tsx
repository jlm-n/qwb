import type { Selection } from '@heroui/react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { IconCaretDownFilled } from '@tabler/icons-react'
import { memo } from 'react'

export const CategoriesDropdown = memo(
	({
		categories,
		categoriesFilter,
		onCategoriesFilterChange,
	}: {
		categories: Record<string, { total: number }>
		categoriesFilter: Selection
		onCategoriesFilterChange: (selection: Selection) => void
	}) => (
		<Dropdown>
			<DropdownTrigger className="hidden sm:flex">
				<Button endContent={<IconCaretDownFilled width={16} />}>Categories</Button>
			</DropdownTrigger>
			<DropdownMenu
				disallowEmptySelection
				aria-label="Category filter"
				closeOnSelect={false}
				selectedKeys={categoriesFilter}
				selectionMode="single"
				onSelectionChange={onCategoriesFilterChange}
			>
				{[
					<DropdownItem showDivider key="all" value="all">
						All
					</DropdownItem>,
					...Object.keys(categories)
						.sort()
						.map((category) => <DropdownItem key={category}>{`${category} (${categories[category].total})`}</DropdownItem>),
				]}
			</DropdownMenu>
		</Dropdown>
	)
)
