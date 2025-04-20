import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useCallback, useState } from 'react'

export interface QbittorrentAddTorrentCommonInput {
	addToTopOfQueue?: boolean // Add torrent to top of queue
	autoTMM?: boolean // Whether Automatic Torrent Management should be used
	category?: string // Category for the torrent
	cookie?: string // Cookie sent to access the urls
	contentLayout?: 'Original' | 'Subfolder' | 'NoSubfolder' // Content layout
	dlLimit?: number // Set torrent download speed limit. Unit in bytes/second
	firstLastPiecePrio?: boolean // Prioritize download first last piece. Possible values are true, false (default)
	paused?: boolean // add torrents paused
	ratioLimit?: number // Set torrent share ratio limit
	rename?: string // Rename torrent
	root_folder?: boolean // Create the root folder. Possible values are true, false, unset (default)
	savepath?: string // Download folder
	seedingTimeLimit?: number // Set torrent seeding time limit. Unit in minutes
	sequentialDownload?: boolean // Enable sequential download. Possible values are true, false (default)
	skip_checking?: boolean // Skip hash checking. Possible values are true, false (default)
	tags?: string[] // Tags for the torrent, split by ','
	upLimit?: number // Set torrent upload speed limit. Unit in bytes/second
}
export type QbittorrentAddTorrentFromMagnetInput = {
	urls: string[] // newline separated list of URLs
} & QbittorrentAddTorrentCommonInput
export type QbittorrentAddTorrentFromFileInput = {
	torrents: FileList // Raw data of torrent file. torrents can be presented multiple times.
} & QbittorrentAddTorrentCommonInput
export type QBittorrentAddTorrentsInput = QbittorrentAddTorrentFromMagnetInput | QbittorrentAddTorrentFromFileInput

function appendFiles(files: FileList | undefined, formData: FormData) {
	if (!files) {
		return
	}

	for (const file of files) {
		formData.append('torrents', file, file.name)
	}
}

export function useAddTorrents(): [(input: QBittorrentAddTorrentsInput) => Promise<void>, boolean, Error | null] {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [serverBaseUrl] = useServerBaseUrl()

	const addTorrents = useCallback(
		async (input: QBittorrentAddTorrentsInput) => {
			setIsLoading(true)

			const formData = new FormData()
			if ('urls' in input) {
				formData.append('urls', input.urls.join('\n'))
			}
			if ('torrents' in input) {
				appendFiles(input.torrents, formData)
			}
			if ('tags' in input && input.tags) {
				formData.append('tags', input.tags.join(','))
			}
			for (const key in input) {
				if (['urls', 'torrents', 'tags'].includes(key)) {
					continue
				}
				formData.append(key, String(input[key as keyof typeof input]))
			}

			try {
				await fetch(`${serverBaseUrl}/api/v2/torrents/add`, {
					method: 'POST',
					credentials: 'include',
					body: formData,
				})
			} catch (e) {
				setError(e as Error)
			} finally {
				setIsLoading(false)
			}
		},
		[serverBaseUrl]
	)

	return [addTorrents, isLoading, error]
}
