import { usePersistentState } from '@/hooks/usePersistentState'

export function useTorrentPiecesRefreshRate() {
	return usePersistentState('torrentPiecesRefreshRate', 2000)
}
