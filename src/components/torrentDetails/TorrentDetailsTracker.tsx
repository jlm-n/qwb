import { useGetTorrentTrackers } from '@/api/useGetTorrentTrackers'
import { useInterval } from '@/hooks/useInterval'
import { useSettings } from '@/hooks/useSettings'
import type { QBittorrentTorrentTrackers } from '@/types/QBittorrentTorrentTrackers'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { useCallback, useEffect, useState } from 'react'

export function TorrentDetailsTracker({
	torrentHash,
}: {
	torrentHash?: string
}) {
	const [getTorrentTrackers] = useGetTorrentTrackers()
	const [trackers, setTrackers] = useState<QBittorrentTorrentTrackers>([])
	const { torrentTrackersRefreshRate } = useSettings()

	const refreshTrackers = useCallback(async () => {
		if (!torrentHash) {
			return
		}
		const trackers = await getTorrentTrackers(torrentHash)
		if (trackers) {
			setTrackers(trackers)
		}
	}, [torrentHash, getTorrentTrackers, setTrackers])

	useEffect(() => {
		refreshTrackers()
	}, [refreshTrackers])
	useInterval(refreshTrackers, torrentTrackersRefreshRate)

	return (
		<Table
			aria-label="Trackers information"
			isHeaderSticky
			isStriped
			classNames={{
				base: 'h-full overflow-auto px-4',
				table: 'mb-14',
			}}
			removeWrapper
		>
			<TableHeader>
				<TableColumn>TIER</TableColumn>
				<TableColumn width="50%">URL</TableColumn>
				<TableColumn>STATUS</TableColumn>
				<TableColumn>PEERS</TableColumn>
				<TableColumn>SEEDS</TableColumn>
				<TableColumn>LEECHES</TableColumn>
				<TableColumn>TIMES DL</TableColumn>
				<TableColumn width="30%">MESSAGE</TableColumn>
			</TableHeader>
			<TableBody>
				{trackers.map((tracker) => (
					<TableRow key={tracker.url}>
						<TableCell>{tracker.tier}</TableCell>
						<TableCell>{tracker.url}</TableCell>
						<TableCell>{tracker.status}</TableCell>
						<TableCell>{tracker.num_peers}</TableCell>
						<TableCell>{tracker.num_seeds}</TableCell>
						<TableCell>{tracker.num_leeches}</TableCell>
						<TableCell>{tracker.num_downloaded}</TableCell>
						<TableCell>{tracker.msg}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
