import { usePersistentState } from '@/hooks/usePersistentState'

export function useTorrentPeersRefreshRate() {
	return usePersistentState('torrentPeersRefreshRate', 2000)
}
