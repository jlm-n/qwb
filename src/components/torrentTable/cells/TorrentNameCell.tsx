import { memo } from 'react'

export const TorrentNameCell = memo(({ name }: { name: string }) => (
	<div className="flex flex-col">
		<p className="text-bold text-small">{name}</p>
	</div>
))
