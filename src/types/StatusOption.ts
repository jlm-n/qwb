import type { ReactNode } from 'react'
import type { QBittorrentTorrentState } from './QBittorrentTorrentState.tsx'

export interface StatusOption {
	name: string
	uid: QBittorrentTorrentState
	icon: ReactNode
}
