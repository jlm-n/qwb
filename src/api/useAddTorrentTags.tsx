import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useAddTorrentTags(): [
	(hashes: string[], taggs: string[]) => Promise<void>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const addTorrentTags = useCallback(
		async (hashes: string[], tags: string[]) => {
			setIsLoading(true)
			try {
				await fetch(`${serverBaseUrl}/api/v2/torrents/addTags`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						hashes: hashes.join('|'),
						tags: tags.join(','),
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

	return [addTorrentTags, isLoading, error]
}
