import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useGetNetworkInterfaces(): [
	() => Promise<Array<{ name: string; value: string }>>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const getNetworkInterfaces = useCallback(async () => {
		setIsLoading(true)
		try {
			const response = await fetch(`${serverBaseUrl}/api/v2/app/networkInterfaceList`, {
				method: 'GET',
				credentials: 'include',
			})
			return await response.json()
		} catch (e) {
			setError(e as Error)
		} finally {
			setIsLoading(false)
		}
	}, [serverBaseUrl, setIsLoading, setError])

	return [getNetworkInterfaces, isLoading, error]
}
