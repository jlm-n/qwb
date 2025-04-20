import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import type { QBittorrentPreferences } from '@/types/QBittorrentPreferences'
import { useCallback, useState } from 'react'

export function useGetPreferences(): [() => Promise<QBittorrentPreferences>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const getPreferences = useCallback(async () => {
		setIsLoading(true)
		try {
			const response = await fetch(`${serverBaseUrl}/api/v2/app/preferences`, {
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

	return [getPreferences, isLoading, error]
}
