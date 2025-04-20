import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import type { QBittorrentTorrentTrackers } from '@/types/QBittorrentTorrentTrackers'
import { useCallback, useState } from 'react'

export function useGetTorrentTrackers(): [(hash: string) => Promise<QBittorrentTorrentTrackers | undefined>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const getTorrentTrackers = useCallback(
		async (hash: string) => {
			setIsLoading(true)
			try {
				const response = await fetch(`${serverBaseUrl}/api/v2/torrents/trackers`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						hash,
					}),
				})
				return (await response.json()) as QBittorrentTorrentTrackers
			} catch (e) {
				setError(e as Error)
			} finally {
				setIsLoading(false)
			}
		},
		[serverBaseUrl]
	)

	return [getTorrentTrackers, isLoading, error]
}
