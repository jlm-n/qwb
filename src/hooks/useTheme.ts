import { usePersistentState } from '@/hooks/usePersistentState'

export function useTheme() {
	const [theme, setTheme] = usePersistentState('theme', 'system')

	return {
		theme,
		setTheme,
	}
} 