import { usePersistentState } from '@/hooks/usePersistentState'

export function useTorrentFilesRefreshRate() {
	return usePersistentState('torrentFilesRefreshRate', 2000)
}
