import type { QBittorrentServerState } from './QBittorrentServerState'
import type { QBittorrentTorrent } from './QBittorrentTorrent'

export interface QbittorrentMaindata {
	rid: number
	server_state: QBittorrentServerState
	torrents: Record<string, QBittorrentTorrent>
	torrents_removed?: string[]
	trackers: Record<string, string[]>
}
