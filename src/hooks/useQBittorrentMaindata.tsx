import { normalizeForSearch } from '@/components/torrentTable/normalizeTorrentName'
import { normalizeTorrentPriority } from '@/components/torrentTable/normalizeTorrentPriority'
import type { QBittorrentMaindata } from '@/types/QBittorrentMaindata'
import type { QBittorrentServerState } from '@/types/QBittorrentServerState'
import type { QBittorrentTorrent } from '@/types/QBittorrentTorrent'
import { useCallback, useState } from 'react'

type QBittorrentTorrentMap = Map<string, QBittorrentTorrent>
type QBittorrentCategories = Record<string, { total: number }>
type QBittorrentTags = Record<string, { total: number }>
type QBittorrentTrackers = Record<string, { total: number }>

interface ProcessedData {
	serverState: QBittorrentServerState
	torrents: QBittorrentTorrent[]
	trackers: QBittorrentTrackers
	categories: QBittorrentCategories
	tags: QBittorrentTags
}

function processTorrents(torrents: QBittorrentTorrentMap, maindata: QBittorrentMaindata): void {
	// Process new and updated torrents
	for (const hash in maindata.torrents) {
		const torrent = maindata.torrents[hash]
		const existing = torrents.get(hash) || { name: '', priority: undefined, tags: '' }

		torrents.set(hash, {
			...existing,
			...torrent,
			hash,
			normalized_name: normalizeForSearch(existing.name || torrent.name || ''),
			normalized_priority: normalizeTorrentPriority(existing.priority ?? torrent.priority),
			normalized_tags: (existing.tags || torrent.tags || '')
				.split(',')
				.map((t) => t.trim())
				.filter((t) => !!t),
		})
	}

	// Remove deleted torrents
	for (const hash of maindata.torrents_removed || []) {
		torrents.delete(hash)
	}
}

function processTrackers(torrents: QBittorrentTorrentMap, maindata: QBittorrentMaindata): void {
	for (const tracker in maindata.trackers) {
		for (const torrentHash of maindata.trackers[tracker]) {
			const existing = torrents.get(torrentHash)
			if (!existing) {
				continue
			}

			torrents.set(torrentHash, {
				...existing,
				tracker,
			})
		}
	}
}

function initializeTagsAndCategories(tags: QBittorrentTags, categories: QBittorrentCategories, maindata: QBittorrentMaindata): void {
	// Initialize tags
	for (const tag of maindata.tags || []) {
		tags[tag] = { total: 0 }
	}
	for (const tag of maindata.tags_removed || []) {
		delete tags[tag]
	}

	// Initialize categories
	for (const category of Object.keys(maindata.categories || {})) {
		if (!categories[category]) {
			categories[category] = { total: 0 }
		}
	}
}

function computeStats(torrents: QBittorrentTorrent[]): {
	trackers: QBittorrentTrackers
	tags: QBittorrentTags
	categories: QBittorrentCategories
} {
	const trackers: QBittorrentTrackers = {}
	const tags: QBittorrentTags = {}
	const categories: QBittorrentCategories = {}

	for (const torrent of torrents) {
		// Process trackers
		if (torrent.tracker) {
			trackers[torrent.tracker] = trackers[torrent.tracker] || { total: 0 }
			trackers[torrent.tracker].total += 1
		}

		// Process tags
		for (const tag of torrent.normalized_tags) {
			tags[tag] = tags[tag] || { total: 0 }
			tags[tag].total += 1
		}

		// Process categories
		if (torrent.category) {
			categories[torrent.category] = categories[torrent.category] || { total: 0 }
			categories[torrent.category].total += 1
		}
	}

	return { trackers, tags, categories }
}

function mergeMaindata(
	TORRENTS: QBittorrentTorrentMap,
	TAGS: QBittorrentTags,
	CATEGORIES: QBittorrentCategories,
	serverState: QBittorrentServerState,
	maindata: QBittorrentMaindata
): ProcessedData {
	// Process torrents and trackers
	processTorrents(TORRENTS, maindata)
	processTrackers(TORRENTS, maindata)

	// Initialize tags and categories
	initializeTagsAndCategories(TAGS, CATEGORIES, maindata)

	// Compute statistics
	const torrents = Array.from(TORRENTS.values())
	const { trackers, tags, categories } = computeStats(torrents)

	return {
		serverState: Object.assign(serverState, maindata.server_state || {}),
		torrents,
		trackers,
		categories: Object.assign(CATEGORIES, categories),
		tags: Object.assign(TAGS, tags),
	}
}

export function useQBittorrentMaindata(): {
	TORRENTS: QBittorrentTorrentMap
	mergeMaindata: (maindata: QBittorrentMaindata) => ProcessedData
} {
	const [torrents] = useState<QBittorrentTorrentMap>(new Map<string, QBittorrentTorrent>())
	const [serverState] = useState<QBittorrentServerState>({})
	const [categories] = useState<QBittorrentCategories>({})
	const [tags] = useState<QBittorrentTags>({})

	const m = useCallback(
		(maindata: QBittorrentMaindata) => {
			return mergeMaindata(torrents, tags, categories, serverState, maindata)
		},
		[torrents, tags, categories, serverState]
	)

	return {
		TORRENTS: torrents,
		mergeMaindata: m,
	}
}
