import { memo } from 'react'

function durationToString(duration: number): string {
	if (duration === 8640000) {
		return '∞'
	}
	const res = []

	const weeks = Math.floor(duration / 604_800)
	if (weeks) {
		res.push(`${weeks}w`)
	}
	duration -= weeks * 604_800

	const days = Math.floor(duration / 86_400)
	if (days) {
		res.push(`${days}d`)
	}
	duration -= days * 86400

	const hours = Math.floor(duration / 3600)
	if (hours) {
		res.push(`${hours}h`)
	}
	duration -= hours * 3600

	const minutes = Math.floor(duration / 60)
	if (minutes) {
		res.push(`${minutes}m`)
	}
	duration -= minutes * 60

	const seconds = duration
	if (seconds) {
		res.push(`${seconds}s`)
	}
	return res.join(' ')
}

export const TorrentETACell = memo(({ value }: { value: number }) => durationToString(value))
