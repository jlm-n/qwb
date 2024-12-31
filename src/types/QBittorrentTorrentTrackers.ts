export interface QBittorrentTorrentTracker {
	msg: string
	num_downloaded: number
	num_leeches: number
	num_peers: number
	num_seeds: number
	status: number
	tier: number
	url: string
}
export type QBittorrentTorrentTrackers = Array<QBittorrentTorrentTracker>
