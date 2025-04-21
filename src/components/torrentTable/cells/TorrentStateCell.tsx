import type { QBittorrentTorrentState } from '@/types/QBittorrentTorrentState'

import { QBittorrentStateIcon } from '@/components/icons/QBittorrentStateIcon'
import { Badge } from '@heroui/react'
import { memo } from 'react'

export const TorrentStatusCell = memo(
	({
		state,
		isNew,
	}: {
		state: QBittorrentTorrentState
		isNew?: boolean
	}) => (
		<div className="flex justify-center" title={state}>
			{isNew ? (
				<Badge color="warning" content="" size="sm">
					<QBittorrentStateIcon state={state} />
				</Badge>
			) : (
				<QBittorrentStateIcon state={state} />
			)}
		</div>
	)
)
