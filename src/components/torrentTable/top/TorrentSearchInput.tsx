import { Input } from '@heroui/input'
import { IconSearch } from '@tabler/icons-react'
import { memo } from 'react'

export const TorrentSearchInput = memo(
	({ searchFilter, onSearchFilterChange }: { searchFilter: string; onSearchFilterChange: (searchFilter?: string) => void }) => (
		<Input
			isClearable
			className="w-full sm:max-w-[44%]"
			placeholder="Search by name..."
			startContent={<IconSearch className="size-4" />}
			value={searchFilter}
			onClear={onSearchFilterChange}
			onValueChange={onSearchFilterChange}
		/>
	)
)
