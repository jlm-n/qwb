import type { QBittorrentTorrent } from '@/types/QBittorrentTorrent'
import type { Selection } from '@heroui/react'
import { usePersistentState } from '@/hooks/usePersistentState'
import { useCallback, useMemo } from 'react'

const INITIAL_VISIBLE_COLUMNS: Array<keyof QBittorrentTorrent> = [
	'priority',
	'name',
	'progress',
	'added_on',
	'dlspeed',
	'upspeed',
	'total_size',
	'state',
	'tracker',
]

export function useVisibleColumns(): [Selection, (value: Selection) => void] {
	const [visibleColumns, setVisibleColumns] = usePersistentState<(string | number)[] | 'all'>('qwbVisibleColumns', INITIAL_VISIBLE_COLUMNS)

	const visibleColumnsSelection = useMemo(() => {
		return visibleColumns === 'all' ? 'all' : new Set(visibleColumns)
	}, [visibleColumns])
	const setVisibleColumnsSelection = useCallback((value: Selection) => {
		setVisibleColumns(value === 'all' ? 'all' : Array.from(value))
	}, [setVisibleColumns])

	return [visibleColumnsSelection, setVisibleColumnsSelection]
}
