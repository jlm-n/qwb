import type { QBittorrentTorrent } from '@/types/QBittorrentTorrent'
import type { Selection, SortDescriptor } from '@heroui/table'
import type { Key } from 'react'
import { normalizeForSearch } from './normalizeTorrentName.ts'

function torrentMatchesName(torrent: QBittorrentTorrent, nameFilter: string[] | null) {
	if (!nameFilter || nameFilter.length === 0) {
		return true
	}
	for (const f of nameFilter) {
		if (!torrent.normalized_name.includes(f)) {
			return false
		}
	}
	return true
}

function torrentMatchesTags(torrent: QBittorrentTorrent, tagFilter: Key[] | null) {
	if (!tagFilter || tagFilter.includes('all')) {
		return true
	}
	return tagFilter.some((tag) => torrent.normalized_tags.includes(tag as string))
}

function torrentMatchesCategory(torrent: QBittorrentTorrent, categoryFilter: Key[] | null) {
	if (!categoryFilter || categoryFilter.includes('all')) {
		return true
	}
	return categoryFilter.includes(torrent.category)
}

function torrentMatchesStatus(torrent: QBittorrentTorrent, statusFilter: Key[] | null) {
	if (!statusFilter || statusFilter.includes('all')) {
		return true
	}

	if (statusFilter.includes('active')) {
		return [
			'downloading',
			'forcedDL',
			'forcedUP',
			'metaDL',
			'uploading',
			'allocating',
			'checkingDL',
			'checkingUP',
			'checkingResumeData',
			'metaDL',
			'moving',
		].includes(torrent.state)
	}
	return statusFilter.includes(torrent.state)
}

function torrentMatchesTracker(torrent: QBittorrentTorrent, trackerFilter: Key[] | null) {
	return !trackerFilter || trackerFilter.some((tracker) => torrent.tracker.includes(tracker as string))
}

function compareTorrents(sortDescriptor: SortDescriptor, a: QBittorrentTorrent, b: QBittorrentTorrent): number {
	let cmp = 0

	if (sortDescriptor.column === 'name') {
		// when sorting by name, we sort secondary by tracker
		if (!a.normalized_name || !b.normalized_name) {
			cmp = 0
		} else {
			cmp = a.normalized_name.localeCompare(b.normalized_name)
		}

		if (cmp === 0) {
			if (!a.tracker || !b.tracker) {
				cmp = 0
			} else {
				cmp = a.tracker.localeCompare(b.tracker)
			}
		}
	} else {
		const first = a[sortDescriptor.column as keyof QBittorrentTorrent] as number
		const second = b[sortDescriptor.column as keyof QBittorrentTorrent] as number
		cmp = first < second ? -1 : first > second ? 1 : 0
	}

	return sortDescriptor.direction === 'ascending' ? cmp : -cmp
}

interface FilteredTorrentsResult {
	pagedTorrents: QBittorrentTorrent[]
	totalTorrentsCount: number
	pagesCount: number
}
export function sortAndFilterTorrents(
	torrents: QBittorrentTorrent[],
	searchFilterValue: string,
	statusFilterValue: Selection,
	trackerFilterValue: Selection,
	tagFilterValue: Selection,
	categoryFilterValue: Selection,
	sortDescriptor: SortDescriptor,
	rowsPerPage: number,
	page: number
): FilteredTorrentsResult {
	const output: QBittorrentTorrent[] = []
	const searchFilter = normalizeForSearch(searchFilterValue)
		.split('+')
		.filter((v) => !!v)
	const statusFilter = statusFilterValue === 'all' ? null : Array.from(statusFilterValue)
	const trackerFilter = trackerFilterValue === 'all' ? null : Array.from(trackerFilterValue)
	const tagFilter = tagFilterValue === 'all' ? null : Array.from(tagFilterValue)
	const categoryFilter = categoryFilterValue === 'all' ? null : Array.from(categoryFilterValue)

	// first we filter on the crieria
	for (const torrent of torrents) {
		if (!torrentMatchesName(torrent, searchFilter)) {
			continue
		}
		if (!torrentMatchesTags(torrent, tagFilter)) {
			continue
		}
		if (!torrentMatchesCategory(torrent, categoryFilter)) {
			continue
		}
		if (!torrentMatchesStatus(torrent, statusFilter)) {
			continue
		}
		if (!torrentMatchesTracker(torrent, trackerFilter)) {
			continue
		}
		output.push(torrent)
	}
	const filteredTorrentLength = output.length

	// then we sort
	output.sort((a, b) => compareTorrents(sortDescriptor, a, b))

	return {
		// then we paginate
		pagedTorrents: output.slice((page - 1) * rowsPerPage, page * rowsPerPage),
		totalTorrentsCount: filteredTorrentLength,
		pagesCount: Math.ceil(filteredTorrentLength / rowsPerPage),
	}
}
