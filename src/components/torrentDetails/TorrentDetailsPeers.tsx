import type { QBittorrentTorrentPeers } from '@/types/QBittorrentTorrentPeer'
import {
	useGetTorrentPeers,
} from '@/api/useGetTorrentPeers'
import { useInterval } from '@/hooks/useInterval'
import { useSettings } from '@/contexts/SettingsContext'
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react'
import prettyBytes from 'pretty-bytes'
import { memo, useCallback, useEffect, useState } from 'react'
import CountryFlag from 'react-emoji-flag'

const CountryFlagCell = memo(({ countryCode }: { countryCode: string }) => (
	<CountryFlag
		countryCode={countryCode}
		className="text-lg"
	/>
))

export function TorrentDetailsPeers({ torrentHash }: { torrentHash?: string }) {
	const [getTorrentPeers] = useGetTorrentPeers()
	const [peers, setPeers] = useState<QBittorrentTorrentPeers | undefined>()
	const { torrentPeersRefreshRate } = useSettings()

	const refreshPeers = useCallback(async () => {
		if (!torrentHash) {
			return
		}
		const peers = await getTorrentPeers(torrentHash)
		setPeers(peers)
	}, [torrentHash, getTorrentPeers, setPeers])

	useEffect(() => {
		refreshPeers()
	}, [refreshPeers])
	useInterval(refreshPeers, torrentPeersRefreshRate)

	if (!peers || !peers.peers) {
		return null
	}

	return (
		<Table
			aria-label="Peers information"
			isHeaderSticky
			isStriped
			classNames={{
				base: 'h-full overflow-auto px-4',
				table: 'mb-14',
			}}
			removeWrapper
		>
			<TableHeader>
				<TableColumn>CN</TableColumn>
				<TableColumn>IP</TableColumn>
				<TableColumn>PORT</TableColumn>
				<TableColumn>CONN.</TableColumn>
				<TableColumn>FLAGS</TableColumn>
				<TableColumn>CLIENT</TableColumn>
				<TableColumn>PROGRESS</TableColumn>
				<TableColumn>DOWN. SPEED</TableColumn>
				<TableColumn>UP. SPEED</TableColumn>
				<TableColumn>DOWNLOADED</TableColumn>
				<TableColumn>UPLOADED</TableColumn>
				<TableColumn>RELEVANCE</TableColumn>
				<TableColumn width="40%">FILE</TableColumn>
			</TableHeader>
			<TableBody>
				{Object.keys(peers.peers)
					.map((key) => {
						const peer = peers?.peers?.[key]
						if (!peer) {
							return undefined
						}
						return (
							<TableRow key={key}>
								<TableCell><CountryFlagCell countryCode={peer.country_code} /></TableCell>
								<TableCell>{peer.ip}</TableCell>
								<TableCell>{peer.port}</TableCell>
								<TableCell>{peer.connection}</TableCell>
								<TableCell>{peer.flags}</TableCell>
								<TableCell>{peer.client}</TableCell>
								<TableCell>
									{(peer.progress * 100).toFixed(2)}
									%
								</TableCell>
								<TableCell>
									{prettyBytes(peer.dl_speed)}
									/s
								</TableCell>
								<TableCell>
									{prettyBytes(peer.up_speed)}
									/s
								</TableCell>
								<TableCell>{prettyBytes(peer.downloaded)}</TableCell>
								<TableCell>{prettyBytes(peer.uploaded)}</TableCell>
								<TableCell>{peer.relevance.toFixed(3)}</TableCell>
								<TableCell>{peer.files.split('/').at(-1)}</TableCell>
							</TableRow>
						)
					})
					.filter(peer => !!peer)}
			</TableBody>
		</Table>
	)
}
