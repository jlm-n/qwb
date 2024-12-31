import { usePersistentState } from '@/hooks/usePersistentState'

export function useTorrentListRefreshRate() {
	return usePersistentState('torrentListRefreshRate', 1000)
}
