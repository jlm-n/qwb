import { Chip } from '@heroui/react'

export function FeerNoPeerTrackerChip() {
	return (
		<Chip
			classNames={{
				base: 'bg-gradient-to-br to-sky-700 from-indigo-500',
				content: 'text-white font-bold',
			}}
			size="sm"
		>
			FNP
		</Chip>
	)
}
