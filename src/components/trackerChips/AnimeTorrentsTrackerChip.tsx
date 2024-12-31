import { Chip } from '@nextui-org/react'

export function AnimeTorrentsTrackerChip() {
	return (
		<Chip
			classNames={{
				base: 'bg-gradient-to-br from-yellow-500 to-orange-500',
				content: 'text-white font-bold',
			}}
			size="sm"
		>
			ANZ
		</Chip>
	)
}
