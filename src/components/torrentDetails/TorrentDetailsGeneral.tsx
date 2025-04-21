import { useGetTorrentProperties } from '@/api/useGetTorrentProperties'
import { useInterval } from '@/hooks/useInterval'
import { useSettings } from '@/hooks/useSettings'
import type { QBittorrentTorrentProperties } from '@/types/QBittorrentTorrentProperties'
import { Divider, Link } from '@heroui/react'
import prettyBytes from 'pretty-bytes'
import { memo, useCallback, useEffect, useState } from 'react'
import { TorrentPiecesProgressBar } from './TorrentPiecesProgressBar'
import { durationToString } from './durationToString'

export const TorrentDetailsGeneral = memo(
	({
		torrentHash,
	}: {
		torrentHash?: string
	}) => {
		const [torrentProperties, setTorrentProperties] = useState<QBittorrentTorrentProperties | undefined>(undefined)
		const [getTorrentProperties] = useGetTorrentProperties()
		const { torrentPropertiesRefreshRate } = useSettings()

		const refreshTorrentProperties = useCallback(async () => {
			if (!torrentHash) {
				return
			}
			const torrentProperties = await getTorrentProperties(torrentHash)
			setTorrentProperties(torrentProperties)
		}, [torrentHash, getTorrentProperties])

		useEffect(() => {
			refreshTorrentProperties()
		}, [refreshTorrentProperties])
		useInterval(refreshTorrentProperties, torrentPropertiesRefreshRate)

		if (!torrentHash || !torrentProperties) {
			return null
		}

		return (
			<div className="flex flex-col gap-4 p-4 mb-10">
				<div className="space-y-2">
					<h4 className="text-medium font-medium">Progress</h4>
					<TorrentPiecesProgressBar torrentHash={torrentHash} />
				</div>
				<Divider />
				<div className="space-y-2">
					<h4 className="text-medium font-medium">Transfer</h4>
					<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						<p className="text-small text-default-400">
							{`Time active: ${durationToString(
								torrentProperties.time_elapsed
							)} (${durationToString(torrentProperties.seeding_time)} seeding)`}
						</p>
						<p className="text-small text-default-400">
							{`ETA: ${torrentProperties.eta >= 8640000 ? '∞' : durationToString(torrentProperties.eta)}`}
						</p>
						<p className="text-small text-default-400">{`Connections: ${torrentProperties.peers}`}</p>
						<p className="text-small text-default-400">
							{`Downloaded: ${prettyBytes(torrentProperties.total_downloaded)} (${prettyBytes(
								torrentProperties.total_downloaded_session
							)} this session)`}
						</p>
						<p className="text-small text-default-400">
							{`Uploaded: ${prettyBytes(torrentProperties.total_uploaded)} (${prettyBytes(
								torrentProperties.total_uploaded_session
							)} this session)`}
						</p>
						<p className="text-small text-default-400">
							{`Seeds: ${torrentProperties.seeds} (${torrentProperties.seeds_total} total)`}
						</p>
						<p className="text-small text-default-400">
							{`Down Speed: ${prettyBytes(
								torrentProperties.dl_speed
							)}/s (${prettyBytes(torrentProperties.dl_speed_avg)}/s avg)`}
						</p>
						<p className="text-small text-default-400">
							{`Upload Speed: ${prettyBytes(
								torrentProperties.up_speed
							)}/s (${prettyBytes(torrentProperties.up_speed_avg)}/s avg)`}
						</p>
						<p className="text-small text-default-400">
							{`Peers: ${torrentProperties.peers} (${torrentProperties.peers_total} total)`}
						</p>
						<p className="text-small text-default-400">{`Down Limit: ${prettyBytes(torrentProperties.dl_limit)}/s`}</p>
						<p className="text-small text-default-400">{`Upload Limit: ${prettyBytes(torrentProperties.up_limit)}/s`}</p>
						<p className="text-small text-default-400">{`Wasted: ${prettyBytes(torrentProperties.total_wasted)}`}</p>
						<p className="text-small text-default-400">{`Share Ratio: ${torrentProperties.share_ratio.toFixed(3)}`}</p>
						<p className="text-small text-default-400">{`Re-announce: ${durationToString(torrentProperties.reannounce)}`}</p>
						<p className="text-small text-default-400">
							{`Last Seen Complete: ${new Date(torrentProperties.last_seen * 1000).toLocaleString()}`}
						</p>
						<p className="text-small text-default-400">{`Popularity: ${torrentProperties.popularity.toFixed(3)}`}</p>
					</div>
				</div>
				<Divider />
				<div className="space-y-2">
					<h4 className="text-medium font-medium">Information</h4>
					<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						<p className="text-small text-default-400">{`Total size: ${prettyBytes(torrentProperties.total_size)}`}</p>
						<p className="text-small text-default-400">
							{`Pieces: ${torrentProperties.pieces_num} x ${prettyBytes(
								torrentProperties.piece_size
							)} (have ${torrentProperties.pieces_have})`}
						</p>
						<p className="text-small text-default-400">{`Created By: ${torrentProperties.created_by}`}</p>
						<p className="text-small text-default-400">
							{`Added On: ${new Date(torrentProperties.addition_date * 1000).toLocaleString()}`}
						</p>
						<p className="text-small text-default-400">
							{`Completed On: ${new Date(torrentProperties.completion_date * 1000).toLocaleString()}`}
						</p>
						<p className="text-small text-default-400">
							{`Created On: ${new Date(torrentProperties.creation_date * 1000).toLocaleString()}`}
						</p>
						<p className="text-small text-default-400">{`Private: ${torrentProperties.is_private ? 'Yes' : 'No'}`}</p>
						<p className="text-small text-default-400">{`Torrent Hash v1: ${torrentProperties.infohash_v1}`}</p>
						<p className="text-small text-default-400">{`Torrent Hash v2: ${torrentProperties.infohash_v2}`}</p>
						<p className="text-small text-default-400">{`Save Path: ${torrentProperties.save_path}`}</p>
						<span className="text-small text-default-400 text-wrap">
							Comment:{' '}
							{torrentProperties.comment.split(/\s+/).map((e) => {
								if (e.startsWith('https://')) {
									return (
										<Link size="sm" key={e} target="_blank" referrerPolicy="no-referrer" href={e}>
											{e}
										</Link>
									)
								}
								return `${e} `
							})}
						</span>
					</div>
				</div>
			</div>
		)
	}
)
