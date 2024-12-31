export enum QBittorrentFilePriority {
	DO_NOT_DOWNLOAD = '0',
	NORMAL = '1',
	HIGHT = '6',
	MAXIMAL = '7',
}

export interface QBittorrentTorrentFile {
	availability: number
	index: number
	is_seed: boolean
	name: string
	piece_range: [number, number]
	priority: QBittorrentFilePriority
	progress: number
	size: number
}
