import type { QBittorrentPreferencesInput } from '@/types/QBittorrentPreferences'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useSetPreferences(): [
	(preferences: QBittorrentPreferencesInput) => Promise<void>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const setPreferences = useCallback(
		async (preferences: QBittorrentPreferencesInput) => {
			setIsLoading(true)
			try {
				const response = await fetch(`${serverBaseUrl}/api/v2/app/setPreferences`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						json: JSON.stringify(preferences),
					}),
				})
				return await response.json()
			} catch (e) {
				setError(e as Error)
			} finally {
				setIsLoading(false)
			}
		},
		[serverBaseUrl, setIsLoading, setError]
	)

	return [setPreferences, isLoading, error]
}
