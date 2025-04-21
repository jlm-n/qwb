import type { Selection } from '@heroui/table'
import { Button, Pagination } from '@heroui/react'
import { memo } from 'react'

export const TorrentTableBottom = memo(
	({
		selectedTorrents,
		filteredItemsLength,
		page,
		pages,
		onPageChange,
	}: { selectedTorrents: Selection; filteredItemsLength: number; page: number; pages: number; onPageChange: (page: number) => void }) => (
		<div className="py-2 px-2 flex justify-between items-center">
			<span className="w-[30%] text-small text-default-400">
				{selectedTorrents === 'all' ? 'All items selected' : `${selectedTorrents.size} of ${filteredItemsLength} selected`}
			</span>
			<Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={onPageChange} />
			<div className="hidden sm:flex w-[30%] justify-end gap-2">
				<Button isDisabled={pages === 1 || page === 1} size="sm" variant="flat" onPress={() => onPageChange(page - 1)}>
					Previous
				</Button>
				<Button isDisabled={pages === 1 || page === pages} size="sm" variant="flat" onPress={() => onPageChange(page + 1)}>
					Next
				</Button>
			</div>
		</div>
	)
)
