import type { Selection } from '@nextui-org/react'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { useTorrentFilesRefreshRate } from '@/hooks/useTorrentFilesRefreshRate'
import { useTorrentListRefreshRate } from '@/hooks/useTorrentListRefreshRate'
import { useTorrentPeersRefreshRate } from '@/hooks/useTorrentPeersRefreshRate'
import { useTorrentPiecesRefreshRate } from '@/hooks/useTorrentPiecesRefreshRate'
import { useTorrentPropertiesRefreshRate } from '@/hooks/useTorrentPropertiesRefreshRate'
import { useTorrentTrackersRefreshRate } from '@/hooks/useTorrentTrackersRefreshRate'
import { useVisibleColumns } from '@/hooks/useVisibleColumns'
import { Input } from '@nextui-org/input'
import { Chip, Select, SelectItem } from '@nextui-org/react'
import { useTheme } from '@nextui-org/use-theme'
import { type ChangeEvent, useCallback } from 'react'
import { TORRENT_TABLE_COLUMNS } from '../torrentTable/TorrentTableColumns'

export function ApplicationSettingsForm() {
	const [serverBaseUrl, setServerBaseUrl] = useServerBaseUrl()
	const [torrentListRefreshRate, setTorrentListRefreshRate] = useTorrentListRefreshRate()
	const [torrentPropertiesRefreshRate, setTorrentPropertiesRefreshRate] = useTorrentPropertiesRefreshRate()
	const [torrentPiecesRefreshRate, setTorrentPiecesRefreshRate] = useTorrentPiecesRefreshRate()
	const [torrentTrackersRefreshRate, setTorrentTrackersRefreshRate] = useTorrentTrackersRefreshRate()
	const [torrentPeersRefreshRate, setTorrentPeersRefreshRate] = useTorrentPeersRefreshRate()
	const [torrentFilesRefreshRate, setTorrentFilesRefreshState] = useTorrentFilesRefreshRate()
	const [visibleColumns, setVisibleColumns] = useVisibleColumns()
	const { theme: currentTheme, setTheme } = useTheme()

	const onThemeChanged = useCallback((newTheme: Selection) => {
		if (newTheme === 'all') {
			return
		}
		setTheme(newTheme.values().next().value as string)
	}, [setTheme])

	return (
		<>
			<Select
				label="Theme"
				items={[
					{ name: 'Light', uid: 'light' },
					{ name: 'Dark', uid: 'dark' },
					{ name: 'Use system theme', uid: 'system' },
				]}
				selectedKeys={[currentTheme]}
				onSelectionChange={onThemeChanged}
				disallowEmptySelection
			>
				{({ name, uid }) => (
					<SelectItem key={uid} textValue={name}>{name}</SelectItem>
				)}
			</Select>

			<Input
				label="Server URL (refresh to apply)"
				type="url"
				value={serverBaseUrl}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setServerBaseUrl(e.target.value)}
			/>
			<Select
				label="Torrent list visible columns (refresh to apply)"
				items={TORRENT_TABLE_COLUMNS}
				selectedKeys={visibleColumns}
				onSelectionChange={setVisibleColumns}
				isMultiline
				selectionMode="multiple"
				disallowEmptySelection
				renderValue={items => (
					<div className="flex flex-wrap gap-2">
						{items.map(item => (
							<Chip key={item.key}>{item.data?.name.toLocaleLowerCase()}</Chip>
						))}
					</div>
				)}
			>
				{({ name, uid, description }) => (
					<SelectItem key={uid} textValue={name}>
						<div className="flex flex-col">
							<span className="text-small">{name}</span>
							<span className="text-tiny text-default-400">{description}</span>
						</div>
					</SelectItem>
				)}
			</Select>

			<Input
				label="Torrent list refresh rate (refresh to apply)"
				type="number"
				min={200}
				value={torrentListRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentListRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
			<Input
				label="Torrent properties refresh rate (refresh to apply)"
				type="number"
				min={200}
				value={torrentPropertiesRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentPropertiesRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
			<Input
				label="Torrent pieces refresh rate (refresh to apply)"
				type="number"
				min={200}
				value={torrentPiecesRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentPiecesRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
			<Input
				label="Torrent trackers refresh rate (refresh to apply)"
				type="number"
				min={200}
				value={torrentTrackersRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentTrackersRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
			<Input
				label="Torrent peers refresh rate (refresh to apply)"
				type="number"
				min={200}
				value={torrentPeersRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentPeersRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
			<Input
				label="Torrent files refresh rate (refresh to apply)"
				type="number"
				min={200}
				value={torrentFilesRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentFilesRefreshState(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
		</>
	)
}
