import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useTheme } from '@/hooks/useTheme'
import { useTorrentFilesRefreshRate } from '@/hooks/useTorrentFilesRefreshRate'
import { useTorrentListRefreshRate } from '@/hooks/useTorrentListRefreshRate'
import { useTorrentPeersRefreshRate } from '@/hooks/useTorrentPeersRefreshRate'
import { useTorrentPiecesRefreshRate } from '@/hooks/useTorrentPiecesRefreshRate'
import { useTorrentPropertiesRefreshRate } from '@/hooks/useTorrentPropertiesRefreshRate'
import { useTorrentTrackersRefreshRate } from '@/hooks/useTorrentTrackersRefreshRate'
import { useVisibleColumns } from '@/hooks/useVisibleColumns'
import type { ReactNode } from 'react'
import { SettingsContext } from './SettingsContext.tsx'

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

	return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
