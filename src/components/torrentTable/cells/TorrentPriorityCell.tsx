import { memo } from 'react'

export const TorrentPriorityCell = memo(({ priority }: { priority: number }) => (
	<p className={priority === Infinity ? 'opacity-30' : ''}>{priority === Infinity ? '∞' : priority}</p>
))
