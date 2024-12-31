export interface QBittorrentTorrentPeer {
	client: string
	connection: string
	country: string
	country_code: string
	dl_speed: number
	downloaded: number
	files: string
	flags: string
	flags_desc: string
	ip: string
	peer_id_client: string
	port: number
	progress: number
	relevance: number
	up_speed: number
	uploaded: number
}

export interface QBittorrentTorrentPeers {
	full_update?: boolean
	peers?: Record<string, QBittorrentTorrentPeer>
	rid: number
	show_flags?: boolean
}
