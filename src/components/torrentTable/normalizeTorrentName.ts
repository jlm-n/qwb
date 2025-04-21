export function normalizeForSearch(value: string): string {
	return value
		.toLowerCase()
		.replace(/[\s[\]()+\-.*^$|{}]+/g, '+')
		.replace(/\++/, '+')
}

export function normalizeFileName(value: string): string {
	return value
		.replace(/[\s[\]()+.*^$|{}]+/g, '.')
		.replace(/\.+/g, '.')
		.replace(/\.-\./g, '-')
}
