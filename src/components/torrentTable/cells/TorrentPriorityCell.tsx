import { memo } from 'react'

export const TorrentPriorityCell = memo(({ priority }: { priority: number }) => (
	<p className={!priority || priority === Infinity ? 'opacity-30' : ''}>
		{!priority || priority === Infinity ? '∞' : priority}
	</p>
))
