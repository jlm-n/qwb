import type { Selection } from '@heroui/react'
import { Input } from '@heroui/input'
import { Chip, Select, SelectItem } from '@heroui/react'
import { type ChangeEvent, useCallback } from 'react'
import { TORRENT_TABLE_COLUMNS } from '../torrentTable/TorrentTableColumns'
import { useSettings } from '@/contexts/SettingsContext'

export function ApplicationSettingsForm() {
	const {
		serverBaseUrl,
		setServerBaseUrl,
		torrentListRefreshRate,
		setTorrentListRefreshRate,
		torrentPropertiesRefreshRate,
		setTorrentPropertiesRefreshRate,
		torrentPiecesRefreshRate,
		setTorrentPiecesRefreshRate,
		torrentTrackersRefreshRate,
		setTorrentTrackersRefreshRate,
		torrentPeersRefreshRate,
		setTorrentPeersRefreshRate,
		torrentFilesRefreshRate,
		setTorrentFilesRefreshRate,
		visibleColumns,
		setVisibleColumns,
		theme,
		setTheme,
	} = useSettings()

	const onThemeChanged = useCallback((newTheme: Selection) => {
		if (newTheme === 'all') {
			return
		}
		const selectedTheme = Array.from(newTheme)[0] as string
		setTheme(selectedTheme)
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
				selectedKeys={new Set([theme])}
				onSelectionChange={onThemeChanged}
				disallowEmptySelection
			>
				{({ name, uid }) => (
					<SelectItem key={uid} textValue={name}>{name}</SelectItem>
				)}
			</Select>

			<Input
				label="Server URL"
				type="url"
				value={serverBaseUrl}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setServerBaseUrl(e.target.value)}
			/>
			<Select
				label="Torrent list visible columns"
				items={TORRENT_TABLE_COLUMNS}
				selectedKeys={visibleColumns}
				onSelectionChange={setVisibleColumns}
				isMultiline
				selectionMode="multiple"
				disallowEmptySelection
				renderValue={items => (
					<div className="flex flex-wrap gap-2">
						{items.sort((a, b) => {
							const indexA = TORRENT_TABLE_COLUMNS.findIndex(col => col.uid === a.data?.uid)
							const indexB = TORRENT_TABLE_COLUMNS.findIndex(col => col.uid === b.data?.uid)
							return indexA - indexB
						}).map(item => (
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
				label="Torrent list refresh rate"
				type="number"
				min={200}
				value={torrentListRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentListRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
			<Input
				label="Torrent properties refresh rate"
				type="number"
				min={200}
				value={torrentPropertiesRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentPropertiesRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
			<Input
				label="Torrent pieces refresh rate"
				type="number"
				min={200}
				value={torrentPiecesRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentPiecesRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
			<Input
				label="Torrent trackers refresh rate"
				type="number"
				min={200}
				value={torrentTrackersRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentTrackersRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
			<Input
				label="Torrent peers refresh rate"
				type="number"
				min={200}
				value={torrentPeersRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentPeersRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
			<Input
				label="Torrent files refresh rate"
				type="number"
				min={200}
				value={torrentFilesRefreshRate.toString()}
				onChange={(e: ChangeEvent<HTMLInputElement>) => setTorrentFilesRefreshRate(+e.target.value)}
				endContent={<p className="text-nowrap">milliseconds</p>}
			/>
		</>
	)
}
