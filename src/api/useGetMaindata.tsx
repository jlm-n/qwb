import type { QBittorrentMaindata } from '@/types/QBittorrentMaindata'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export function useGetMaindata(): [
	(rid: number) => Promise<QBittorrentMaindata>,
	boolean,
	Error | null,
] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const getMaindata = useCallback(
		async (rid: number) => {
			setIsLoading(true)
			try {
				const response = await fetch(`${serverBaseUrl}/api/v2/sync/maindata?rid=${rid}`, {
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
		[serverBaseUrl, setIsLoading, setError]
	)

	return [getMaindata, isLoading, error]
}

export function useGetIncrementalMaindata(): [
	() => Promise<QBittorrentMaindata>,
	boolean,
	Error | null,
	number,
] {
	const [rid, setRid] = useState(0)
	const [getMaindata, isGetMaindataLoading, getMaindataError] = useGetMaindata()

	const getIncrementalMaindata = useCallback(async () => {
		const maindata = await getMaindata(rid)

		if (!maindata) {
			throw new Error('Error when receiving data from the server')
		}

		setRid(maindata.rid)

		return maindata
	}, [getMaindata, rid, setRid])

	return [getIncrementalMaindata, isGetMaindataLoading, getMaindataError, rid]
}
