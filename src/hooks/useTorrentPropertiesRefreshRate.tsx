import { usePersistentState } from '@/hooks/usePersistentState'

export function useTorrentPropertiesRefreshRate() {
	return usePersistentState('torrentPropertiesRefreshRate', 2000)
}
