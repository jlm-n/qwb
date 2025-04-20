import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useRenameTorrent(): [(hashes: string, location: string) => Promise<void>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const renameTorrent = useCallback(
		async (hash: string, name: string) => {
			setIsLoading(true)
			try {
				await fetch(`${serverBaseUrl}/api/v2/torrents/rename`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						name,
						hash,
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

	return [renameTorrent, isLoading, error]
}
