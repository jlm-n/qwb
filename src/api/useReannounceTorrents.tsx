import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useReannounceTorrents(): [(hashes: string[]) => Promise<void>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const reannounceTorrents = useCallback(
		async (hashes: string[]) => {
			setIsLoading(true)
			try {
				await fetch(`${serverBaseUrl}/api/v2/torrents/reannounce`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						hashes: hashes.join('|'),
					}),
				})
			} catch (e) {
				setError(e as Error)
			} finally {
				setIsLoading(false)
			}
		},
		[serverBaseUrl]
	)

	return [reannounceTorrents, isLoading, error]
}
