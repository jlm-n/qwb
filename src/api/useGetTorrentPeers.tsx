import type { QBittorrentTorrentPeers } from '@/types/QBittorrentTorrentPeer'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useGetTorrentPeers(): [
	(hash: string) => Promise<QBittorrentTorrentPeers | undefined>,
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
				const response = await fetch(`${serverBaseUrl}/api/v2/sync/torrentPeers`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						hash,
					}),
				})
				return (await response.json()) as QBittorrentTorrentPeers
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
