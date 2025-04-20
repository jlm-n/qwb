import type { Selection } from '@heroui/react'
import { createContext } from 'react'

interface SettingsContextType {
	serverBaseUrl: string
	setServerBaseUrl: (value: string) => void
	torrentListRefreshRate: number
	setTorrentListRefreshRate: (value: number) => void
	torrentPropertiesRefreshRate: number
	setTorrentPropertiesRefreshRate: (value: number) => void
	torrentPiecesRefreshRate: number
	setTorrentPiecesRefreshRate: (value: number) => void
	torrentTrackersRefreshRate: number
	setTorrentTrackersRefreshRate: (value: number) => void
	torrentPeersRefreshRate: number
	setTorrentPeersRefreshRate: (value: number) => void
	torrentFilesRefreshRate: number
	setTorrentFilesRefreshRate: (value: number) => void
	visibleColumns: Selection
	setVisibleColumns: (value: Selection) => void
	theme: string
	setTheme: (value: string) => void
}

export const SettingsContext = createContext<SettingsContextType | null>(null)
