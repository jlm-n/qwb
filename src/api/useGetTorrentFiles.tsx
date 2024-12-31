import type { QBittorrentTorrentFile } from '@/types/QBittorrentTorrentFile'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useGetTorrentFiles(): [
	(hash: string) => Promise<QBittorrentTorrentFile[] | undefined>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const getTorrentFiles = useCallback(
		async (hash: string) => {
			setIsLoading(true)
			try {
				const response = await fetch(
					`${serverBaseUrl}/api/v2/torrents/files`,
					{
						method: 'POST',
						credentials: 'include',
						body: new URLSearchParams({
							hash,
						}),
					},
				)
				return (await response.json()) as QBittorrentTorrentFile[]
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

	return [getTorrentFiles, isLoading, error]
}
