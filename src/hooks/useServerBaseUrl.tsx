import { usePersistentState } from '@/hooks/usePersistentState'

export function useServerBaseUrl() {
	return usePersistentState('serverBaseUrl', '')
}
