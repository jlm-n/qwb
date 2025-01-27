import type { QBittorrentTorrentFile } from '@/types/QBittorrentTorrentFile'
import { normalizeFileName } from './normalizeTorrentName'

function machesTvEpisode(value: string): boolean {
	const regex = [
		/[.\s]+S\d+E\d+[.\s]+/gi,
		/[.\s]+S\d+[.\s]+E\d+[.\s]+/gi,
	]
	return regex.some(r => r.test(value))
}

function machesTvSeason(value: string): boolean {
	const regex = [
		/[.\s]+S\d+[.\s]+/gi,
	]
	return regex.some(r => r.test(value))
}

function trimFileExtension(fileName: string): string {
	return fileName.replace(/\.[^/.]+$/, '')
}

export function normalizeTorrentPath(torrentName: string, files: QBittorrentTorrentFile[] | undefined): string {
	const normalizedName = normalizeFileName(torrentName)

	if (machesTvEpisode(normalizedName)) {
		// eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group
		const tvShowName = normalizedName.match(/(.+)[.\s]+S\d+/i)?.[1]
		if (!tvShowName) {
			throw new Error(`Could not get tv show name for torrent ${torrentName}`)
		}

		const seasonNumber = normalizedName.match(/[.\s]+S(\d+)/i)?.[1]
		if (seasonNumber === undefined) {
			throw new Error(`Could not get season number for torrent ${torrentName}`)
		}

		const episodeNumber = normalizedName.match(/[.\s\d]+E(\d+)[.\s]+/i)?.[1]
		if (episodeNumber === undefined) {
			throw new Error(`Could not get episode number for torrent ${torrentName}`)
		}

		if (Number.parseInt(seasonNumber) === 0) {
			return `/tvshows/${tvShowName}/Specials`
		}
		return `/tvshows/${tvShowName}/Season.${Number.parseInt(seasonNumber).toString().padStart(2, '0')}`
	}
	else if (machesTvSeason(normalizedName)) {
		// eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group
		const tvShowName = normalizedName.match(/(.+)[.\s]+S\d+/i)?.[1]
		if (!tvShowName) {
			throw new Error(`Could not get tv show name for torrent ${torrentName}`)
		}
		return `/tvshows/${tvShowName}`
	}
	else {
		if (files && files[0] && files[0].name.includes('/')) {
			// this is a file in a sub-folder, we save it at the root directory
			return '/movies'
		}
		return `/movies/${trimFileExtension(normalizeFileName(torrentName))}`
	}
	throw new Error('Could not compute a save path for the torrent file')
}
