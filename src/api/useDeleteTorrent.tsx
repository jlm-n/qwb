import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useDeleteTorrents(): [
	(hashes: string[], deleteFiles?: boolean) => Promise<void>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const deleteTorrent = useCallback(
		async (hashes: string[], deleteFiles?: boolean) => {
			setIsLoading(true)
			try {
				await fetch(`${serverBaseUrl}/api/v2/torrents/delete`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						deleteFiles: deleteFiles ? 'true' : 'false',
						hashes: hashes.join('|'),
					}),
				})
			} catch (e) {
				setError(e as Error)
			} finally {
				setIsLoading(false)
			}
		},
		[serverBaseUrl, setIsLoading, setError]
	)

	return [deleteTorrent, isLoading, error]
}
