import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useGetNetworkAddresses(): [(iface: string) => Promise<string[]>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const getNetworkAddresses = useCallback(
		async (iface: string) => {
			setIsLoading(true)
			try {
				const response = await fetch(`${serverBaseUrl}/api/v2/app/networkInterfaceAddressList?iface=${iface}`, {
					method: 'GET',
					credentials: 'include',
				})
				return await response.json()
			} catch (e) {
				setError(e as Error)
			} finally {
				setIsLoading(false)
			}
		},
		[serverBaseUrl]
	)

	return [getNetworkAddresses, isLoading, error]
}
