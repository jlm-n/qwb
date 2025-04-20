import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useDecreaseTorrentPrio(): [(hashes: string[]) => Promise<void>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const decreaseTorrentPrio = useCallback(
		async (hashes: string[]) => {
			setIsLoading(true)
			try {
				await fetch(`${serverBaseUrl}/api/v2/torrents/decreasePrio`, {
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

	return [decreaseTorrentPrio, isLoading, error]
}
