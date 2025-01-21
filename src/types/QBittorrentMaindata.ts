import type { QBittorrentCategories } from './QBittorrentCategories'
import type { QBittorrentServerState } from './QBittorrentServerState'
import type { QBittorrentTorrent } from './QBittorrentTorrent'

export interface QBittorrentMaindata {
	categories?: QBittorrentCategories // Info for categories added since last request
	categories_removed?: string[] // List of categories removed since last request
	full_update?: boolean // Whether the response contains all the data or partial data
	rid: number // Response ID
	server_state?: QBittorrentServerState // Global transfer info
	tags?: string[] // List of tags added since last request
	tags_removed?: string[] // List of tags removed since last request
	torrents?: Record<string, QBittorrentTorrent> // Property: torrent hash, value: same as torrent list
	torrents_removed?: string[] // List of hashes of torrents removed since last request
	trackers?: Record<string, string[]>
}
