import { useCallback, useState } from 'react'

function getStorageValue<T>(key: string, defaultValue: T) {
	const saved = localStorage.getItem(key)
	try {
		const parsedValue = JSON.parse(saved || '')
		return parsedValue || defaultValue
	}
	// eslint-disable-next-line unused-imports/no-unused-vars
	catch (e) {
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
		[key, setStateValue],
	)

	const unsetValue = useCallback(
		(key: string) => {
			localStorage.removeItem(key)
		},
		[],
	)

	return [stateValue, setValue, unsetValue]
}
