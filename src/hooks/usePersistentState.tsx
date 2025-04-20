import { useCallback, useState } from 'react'

function getStorageValue<T>(key: string, defaultValue: T) {
	const saved = localStorage.getItem(key)
	try {
		const parsedValue = JSON.parse(saved || '')
		return parsedValue || defaultValue
	} catch (_) {
		return defaultValue
	}
}

export function usePersistentState<T>(key: string, defaultValue: T): [T, (value: T) => void, (key: string) => void] {
	const [stateValue, setStateValue] = useState<T>(() => {
		return getStorageValue(key, defaultValue)
	})

	const setValue = useCallback(
		(value: T) => {
			setStateValue(value)
			localStorage.setItem(key, JSON.stringify(value))
		},
		[key]
	)

	const unsetValue = useCallback((key: string) => {
		localStorage.removeItem(key)
	}, [])

	return [stateValue, setValue, unsetValue]
}
