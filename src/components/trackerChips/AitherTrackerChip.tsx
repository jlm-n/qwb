import { Chip } from '@nextui-org/react'

export function AitherTrackerChip() {
	return (
		<Chip
			classNames={{
				base: 'bg-gradient-to-br from-blue-500 to-teal-500',
				content: 'text-white font-bold',
			}}
			size="sm"
		>
			ATH
		</Chip>
	)
}
