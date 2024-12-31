import type { QBittorrentTorrentFile } from '@/types/QBittorrentTorrentFile'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useSetFilePriority(): [
	(hash: string, fileIds: string[], priority: QBittorrentTorrentFile['priority']) => Promise<void>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const setFilePriority = useCallback(
		async (hash: string, fileIds: string[], priority: QBittorrentTorrentFile['priority']) => {
			setIsLoading(true)
			try {
				await fetch(`${serverBaseUrl}/api/v2/torrents/filePrio`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						hash,
						id: fileIds.join('|'),
						priority,
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

	return [setFilePriority, isLoading, error]
}
