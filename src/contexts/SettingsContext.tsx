import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useTorrentListRefreshRate } from '@/hooks/useTorrentListRefreshRate'
import { useTorrentPropertiesRefreshRate } from '@/hooks/useTorrentPropertiesRefreshRate'
import { useTorrentPiecesRefreshRate } from '@/hooks/useTorrentPiecesRefreshRate'
import { useTorrentTrackersRefreshRate } from '@/hooks/useTorrentTrackersRefreshRate'
import { useTorrentPeersRefreshRate } from '@/hooks/useTorrentPeersRefreshRate'
import { useTorrentFilesRefreshRate } from '@/hooks/useTorrentFilesRefreshRate'
import { useVisibleColumns } from '@/hooks/useVisibleColumns'
import { useTheme } from '@/hooks/useTheme'
import type { Selection } from '@heroui/react'

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

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [serverBaseUrl, setServerBaseUrl] = useServerBaseUrl()
	const [torrentListRefreshRate, setTorrentListRefreshRate] = useTorrentListRefreshRate()
	const [torrentPropertiesRefreshRate, setTorrentPropertiesRefreshRate] = useTorrentPropertiesRefreshRate()
	const [torrentPiecesRefreshRate, setTorrentPiecesRefreshRate] = useTorrentPiecesRefreshRate()
	const [torrentTrackersRefreshRate, setTorrentTrackersRefreshRate] = useTorrentTrackersRefreshRate()
	const [torrentPeersRefreshRate, setTorrentPeersRefreshRate] = useTorrentPeersRefreshRate()
	const [torrentFilesRefreshRate, setTorrentFilesRefreshRate] = useTorrentFilesRefreshRate()
	const [visibleColumns, setVisibleColumns] = useVisibleColumns()
	const { theme, setTheme } = useTheme()

	const value = {
		serverBaseUrl,
		setServerBaseUrl,
		torrentListRefreshRate,
		setTorrentListRefreshRate,
		torrentPropertiesRefreshRate,
		setTorrentPropertiesRefreshRate,
		torrentPiecesRefreshRate,
		setTorrentPiecesRefreshRate,
		torrentTrackersRefreshRate,
		setTorrentTrackersRefreshRate,
		torrentPeersRefreshRate,
		setTorrentPeersRefreshRate,
		torrentFilesRefreshRate,
		setTorrentFilesRefreshRate,
		visibleColumns,
		setVisibleColumns,
		theme,
		setTheme,
	}

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	)
}

export function useSettings() {
	const context = useContext(SettingsContext)
	if (!context) {
		throw new Error('useSettings must be used within a SettingsProvider')
	}
	return context
}