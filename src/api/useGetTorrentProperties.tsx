import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import type { QBittorrentTorrentProperties } from '@/types/QBittorrentTorrentProperties'
import { useCallback, useState } from 'react'

export function useGetTorrentProperties(): [(hash: string) => Promise<QBittorrentTorrentProperties | undefined>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const getTorrentProperties = useCallback(
		async (hash: string) => {
			setIsLoading(true)
			try {
				const response = await fetch(`${serverBaseUrl}/api/v2/torrents/properties`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						hash,
					}),
				})
				return (await response.json()) as QBittorrentTorrentProperties
			} catch (e) {
				setError(e as Error)
			} finally {
				setIsLoading(false)
			}
		},
		[serverBaseUrl]
	)

	return [getTorrentProperties, isLoading, error]
}
