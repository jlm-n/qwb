import type { QBittorrentCategories } from '@/types/QBittorrentCategories'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useGetCategories(): [
	() => Promise<QBittorrentCategories>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const getCategories = useCallback(async () => {
		setIsLoading(true)
		try {
			const response = await fetch(
				`${serverBaseUrl}/api/v2/torrents/categories`,
				{
					method: 'GET',
					credentials: 'include',
				},
			)
			return await response.json()
		}
		catch (e) {
			setError(e as Error)
		}
		finally {
			setIsLoading(false)
		}
	}, [serverBaseUrl, setIsLoading, setError])

	return [getCategories, isLoading, error]
}
