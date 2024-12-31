import { Chip } from '@nextui-org/react'

export function YoinkedTrackerChip() {
	return (
		<Chip
			classNames={{
				base: 'bg-gradient-to-br from-pink-500 to-pink-700',
				content: 'text-white font-bold',
			}}
			size="sm"
		>
			YNK
		</Chip>
	)
}
