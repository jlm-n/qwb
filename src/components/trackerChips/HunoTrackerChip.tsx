import { Chip } from '@nextui-org/react'

export function HunoTrackerChip() {
	return (
		<Chip
			classNames={{
				base: 'bg-gradient-to-br from-sky-500 to-red-500',
				content: 'text-white font-bold',
			}}
			size="sm"
		>
			UNO
		</Chip>
	)
}
