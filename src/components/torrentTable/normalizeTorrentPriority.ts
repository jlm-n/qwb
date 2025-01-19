export function normalizeTorrentPriority(value: number | null | undefined): number {
	if (value === null || value === undefined) {
		return Infinity
	}
	if (value <= 0) {
		return Infinity
	}
	return value
}
