import { usePersistentState } from '@/hooks/usePersistentState'

export function useTorrentTrackersRefreshRate() {
	return usePersistentState('torrentTrackersRefreshRate', 2000)
}
