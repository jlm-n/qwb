import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import type { QBittorrentTags } from '@/types/QBittorrentTags'
import { useCallback, useState } from 'react'

export function useGetTags(): [() => Promise<QBittorrentTags>, boolean, Error | null] {
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
	}, [serverBaseUrl])

	return [getTags, isLoading, error]
}
