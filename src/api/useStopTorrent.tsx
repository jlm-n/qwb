import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useStopTorrents(): [(hashes: string[]) => Promise<void>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const stopTorrent = useCallback(
		async (hashes: string[]) => {
			setIsLoading(true)
			try {
				await fetch(`${serverBaseUrl}/api/v2/torrents/stop`, {
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

	return [stopTorrent, isLoading, error]
}
