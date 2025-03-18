import type { QBittorrentTorrentPieceStates } from '@/types/QBittorrentTorrentPieceState'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useGetTorrentPieceStates(): [
	(hash: string) => Promise<QBittorrentTorrentPieceStates | undefined>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const getTorrentPieceStates = useCallback(
		async (hash: string) => {
			setIsLoading(true)
			try {
				const response = await fetch(`${serverBaseUrl}/api/v2/torrents/pieceStates`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						hash,
					}),
				})
				return (await response.json()) as QBittorrentTorrentPieceStates
			} catch (e) {
				setError(e as Error)
			} finally {
				setIsLoading(false)
			}
		},
		[serverBaseUrl, setIsLoading, setError]
	)

	return [getTorrentPieceStates, isLoading, error]
}
