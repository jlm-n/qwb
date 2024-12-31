import prettyBytes from 'pretty-bytes'
import { memo } from 'react'

export const TorrentBitrateCell = memo(({ bitrate }: { bitrate?: number }) => {
	if (!bitrate) {
		return null
	}

	return (
		<div className="flex flex-col">
			<p className="text-bold text-small">{`${prettyBytes(bitrate)}/s`}</p>
		</div>
	)
})
