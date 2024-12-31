import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useRenameFolder(): [
	(hash: string, oldPath: string, newPath: string) => Promise<void>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const renameFolder = useCallback(
		async (hash: string, oldPath: string, newPath: string) => {
			setIsLoading(true)
			try {
				await fetch(`${serverBaseUrl}/api/v2/torrents/renameFolder`, {
					method: 'POST',
					credentials: 'include',
					body: new URLSearchParams({
						hash,
						oldPath,
						newPath,
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

	return [renameFolder, isLoading, error]
}
