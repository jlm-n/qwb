import type { QBittorrentTorrentState } from '@/types/QBittorrentTorrentState'

import { CircularProgress } from '@heroui/react'
import { memo } from 'react'

export const TorrentProgressCell = memo(({
	progress,
	torrentState,
}: {
	progress: number
	torrentState: QBittorrentTorrentState
}) => {
	return progress < 1
		? (
				<span className="flex gap-1" title={torrentState}>
					<CircularProgress
						aria-label={torrentState}
						classNames={{
							svg: 'w-5 h-5',
						}}
						color={progress === 1 ? 'success' : 'primary'}
						disableAnimation={progress === 1}
						formatOptions={{
							style: 'percent',
							minimumFractionDigits: 0,
							maximumFractionDigits: 2,
						}}
						size="sm"
						value={progress * 100}
					/>
					<span>
						{(progress * 100).toFixed(2)}
						%
					</span>
				</span>
			)
		: (
				<span>done</span>
			)
})
