import { Chip } from '@heroui/react'

export function BlutopiaTrackerChip() {
	return (
		<Chip
			classNames={{
				base: 'bg-gradient-to-br from-blue-500 to-pink-500',
				content: 'text-white font-bold',
			}}
			size="sm"
		>
			BLU
		</Chip>
	)
}
