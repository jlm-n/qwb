import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useChangeTorrentLocation(): [
	(hashes: string[], location: string) => Promise<void>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const changeTorentLocation = useCallback(
		async (hashes: string[], location: string) => {
			setIsLoading(true)
			try {
				await fetch(`${serverBaseUrl}/api/v2/torrents/setLocation`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						location,
						hashes: hashes.join('|'),
					}),
				})
			}
			catch (e) {
				setError(e as Error)
			}
			finally {
				setIsLoading(false)
			}
		},
		[serverBaseUrl, setIsLoading, setError],
	)

	return [changeTorentLocation, isLoading, error]
}
