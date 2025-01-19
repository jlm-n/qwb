import { Chip } from '@heroui/react'

export function DefaultTrackerChip({
	trackerHostname,
}: {
	trackerHostname: string
}) {
	return <Chip size="sm">{trackerHostname}</Chip>
}
