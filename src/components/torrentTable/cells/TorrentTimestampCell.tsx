import { memo } from 'react'

export const TorrentTimestampCell = memo(({ timestamp }: { timestamp: number }) => {
	if (timestamp < 0) {
		return null
	}

	const date = new Date(timestamp * 1000).toLocaleDateString(
		navigator.language,
		{
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		},
	)

	return (
		<div className="flex flex-col">
			<p className="text-bold text-small">{date}</p>
		</div>
	)
})
