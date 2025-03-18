import type { QbittorrentTags } from '@/types/QBittorrentTag'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useGetTags(): [() => Promise<QbittorrentTags>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const getTags = useCallback(async () => {
		setIsLoading(true)
		try {
			const response = await fetch(`${serverBaseUrl}/api/v2/torrents/tags`, {
				method: 'GET',
				credentials: 'include',
			})
			return await response.json()
		} catch (e) {
			setError(e as Error)
		} finally {
			setIsLoading(false)
		}
	}, [serverBaseUrl, setIsLoading, setError])

	return [getTags, isLoading, error]
}
