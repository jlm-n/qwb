import { SettingsContext } from '@/contexts/SettingsContext'
import { useContext } from 'react'

export function useSettings() {
	const context = useContext(SettingsContext)
	if (!context) {
		throw new Error('useSettings must be used within a SettingsProvider')
	}
	return context
}
