import { TorrentContextMenu } from '@/components/TorrentContextMenu'
import { memo } from 'react'

export const TorrentContextMenuCell = memo(({
	torrentHash,
	torrentName,
	torrentLocation,
}: {
	torrentHash: string
	torrentLocation: string
	torrentName: string
}) => (
	<div className="relative flex justify-end items-center gap-2">
		<TorrentContextMenu
			torrentLocation={torrentLocation}
			torrentName={torrentName}
			torrentHashes={[torrentHash]}
		/>
	</div>
))
