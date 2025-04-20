import type { QBittorrentTorrent } from './QBittorrentTorrent.tsx'

export type ColumnOption =
	| {
			name: string
			uid: keyof QBittorrentTorrent
			sortable: boolean
			description: string
			width?: number | `${number}%`
			hideHeader?: true
	  }
	| {
			name: string
			uid: 'actions'
			sortable: false
			description: string
			width?: number
			hideHeader?: true
	  }
