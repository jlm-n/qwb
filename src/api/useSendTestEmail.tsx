import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useSendTestEmail(): [() => Promise<void>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const sentTestEmail = useCallback(async () => {
		setIsLoading(true)
		try {
			await fetch(`${serverBaseUrl}/api/v2/app/sendTestEmail`, {
				method: 'POST',
				credentials: 'include',
			})
		} catch (e) {
			setError(e as Error)
		} finally {
			setIsLoading(false)
		}
	}, [serverBaseUrl])

	return [sentTestEmail, isLoading, error]
}
