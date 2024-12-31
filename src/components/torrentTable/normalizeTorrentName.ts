export function searchNormalize(value: string): string {
	return value
		.toLowerCase()
		.replace(/[\s[\]()+\-.*^$|{}]+/g, '+')
		.replace(/\++/, '+')
}

export function fileNameNormalize(value: string): string {
	return value.replace(/[\s[\]()+.*^$|{}]+/g, '.').replace(/\.+/g, '.').replace(/\.-\./g, '-')
}
