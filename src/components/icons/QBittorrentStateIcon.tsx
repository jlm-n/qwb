import type { QBittorrentTorrentState } from '@/types/QBittorrentTorrentState'
import { QBITTORRENT_STATE_TO_ICON } from './QBittorrentStateToIcon.tsx'

export function QBittorrentStateIcon({
	state,
}: {
	state: QBittorrentTorrentState
}) {
	return QBITTORRENT_STATE_TO_ICON[state]
}
