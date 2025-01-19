import { type QBittorrentPreferences, QBittorrentPreferencesEncryptionMode, QBittorrentPreferencesMaxRatioAct } from '@/types/QBittorrentPreferences'
import { Input, Textarea } from '@heroui/input'
import { Checkbox, Divider, Link, Select, SelectItem } from '@heroui/react'
import { IconExternalLink } from '@tabler/icons-react'
import { memo, useState } from 'react'

export const BittorrentSettingsSection = memo(({
	dht,
	dht_bootstrap_nodes,
	pex,
	lsd,
	encryption,
	anonymous_mode,
	max_active_checking_torrents,
	queueing_enabled,
	max_active_downloads,
	max_active_uploads,
	max_active_torrents,
	dont_count_slow_torrents,
	slow_torrent_dl_rate_threshold,
	slow_torrent_ul_rate_threshold,
	slow_torrent_inactive_timer,
	max_ratio_act,
	max_ratio_enabled,
	max_ratio,
	max_seeding_time_enabled,
	max_seeding_time,
	max_inactive_seeding_time_enabled,
	max_inactive_seeding_time,
	add_trackers_enabled,
	add_trackers,
}: Pick<
	QBittorrentPreferences,
	'dht'
	| 'dht_bootstrap_nodes'
	| 'pex'
	| 'lsd'
	| 'encryption'
	| 'anonymous_mode'
	| 'max_active_checking_torrents'
	| 'queueing_enabled'
	| 'max_active_downloads'
	| 'max_active_uploads'
	| 'max_active_torrents'
	| 'dont_count_slow_torrents'
	| 'slow_torrent_dl_rate_threshold'
	| 'slow_torrent_ul_rate_threshold'
	| 'slow_torrent_inactive_timer'
	| 'max_ratio_act'
	| 'max_ratio_enabled'
	| 'max_ratio'
	| 'max_seeding_time_enabled'
	| 'max_seeding_time'
	| 'max_inactive_seeding_time_enabled'
	| 'max_inactive_seeding_time'
	| 'add_trackers_enabled'
	| 'add_trackers'
>) => {
	const [dhtEnabledState, setDHTEnabledState] = useState(dht)
	const [torrentQueuingEnabledState, setTorrentQueuingEnabledState] = useState(queueing_enabled)
	const [dontCountSlowTorrentsEnabledState, setDontCountSlowTorrentsEnabledState] = useState(dont_count_slow_torrents)
	const [maxRatioEnabledState, setMaxRatioEnabledState] = useState(max_ratio_enabled)
	const [maxSeedingTimeEnabledState, setMaxSeedingTimeEnabledState] = useState(max_seeding_time_enabled)
	const [maxInactiveSeedingTimeEnabledState, setMaxInactiveSeedingTimeEnabledState] = useState(max_inactive_seeding_time_enabled)
	const [addTrackersEnabledState, setAddTrackersEnabledState] = useState(add_trackers_enabled)

	return (
		<>
			<Checkbox name="dht" isSelected={dhtEnabledState} onValueChange={setDHTEnabledState}>Enable DHT (decentralized network) to find more peers</Checkbox>
			<Input
				name="dht_bootstrap_nodes"
				isDisabled={!dhtEnabledState}
				color="warning"
				label="DHT bootstrap nodes"
				defaultValue={dht_bootstrap_nodes}
				endContent={<Link color="warning" href="https://www.libtorrent.org/reference-Settings.html#dht_bootstrap_nodes" target="_blank" referrerPolicy="no-referrer"><IconExternalLink /></Link>}
			/>
			<Checkbox name="pex" defaultSelected={pex}>Enable Peer Exchange (PeX) to find more peers</Checkbox>
			<Checkbox name="lsd" defaultSelected={lsd}>Enable Local Peer Discovery to find more peers</Checkbox>
			<Select name="encryption" label="Encryption mode" defaultSelectedKeys={encryption !== undefined ? new Set([encryption.toString()]) : new Set()}>
				<SelectItem key={QBittorrentPreferencesEncryptionMode.PREFER_ENCRYPTION.toString()}>Prefer encryption</SelectItem>
				<SelectItem key={QBittorrentPreferencesEncryptionMode.FORCE_ENCRYPTION_ON.toString()}>Require encryption</SelectItem>
				<SelectItem key={QBittorrentPreferencesEncryptionMode.FORCE_ENCRYPTION_OFF.toString()}>Disable encryption</SelectItem>
			</Select>
			<div className="flex gap-1">
				<Checkbox name="anonymous_mode" defaultSelected={anonymous_mode}>Enable anonymous mode</Checkbox>
				<Link href="https://github.com/qbittorrent/qBittorrent/wiki/Anonymous-Mode" target="_blank" referrerPolicy="no-referrer">More information</Link>
			</div>
			<Divider className="my-2" />

			<Input
				name="max_active_checking_torrents"
				label="Max active checking torrents"
				defaultValue={max_active_checking_torrents?.toString()}
				type="number"
			/>
			<Divider className="my-2" />

			<Checkbox name="queueing_enabled" isSelected={torrentQueuingEnabledState} onValueChange={setTorrentQueuingEnabledState}>Enable torrent queueing</Checkbox>
			<Input
				name="max_active_downloads"
				label="Max active downloads"
				isDisabled={!torrentQueuingEnabledState}
				defaultValue={max_active_downloads?.toString()}
				type="number"
			/>
			<Input
				name="max_active_uploads"
				label="Max active uploads"
				isDisabled={!torrentQueuingEnabledState}
				defaultValue={max_active_uploads?.toString()}
				type="number"
			/>
			<Input
				name="max_active_torrents"
				label="Max active torrents"
				isDisabled={!torrentQueuingEnabledState}
				defaultValue={max_active_torrents?.toString()}
				type="number"
			/>
			<Checkbox name="dont_count_slow_torrents" isSelected={dontCountSlowTorrentsEnabledState} onValueChange={setDontCountSlowTorrentsEnabledState}>Do not count slow torrents in torrent queueing</Checkbox>
			<Input
				name="slow_torrent_dl_rate_threshold"
				label="Slow torrents download rate threshold"
				isDisabled={!dontCountSlowTorrentsEnabledState}
				defaultValue={slow_torrent_dl_rate_threshold?.toString()}
				endContent={<p className="text-nowrap">KiB/s</p>}
				type="number"
			/>
			<Input
				name="slow_torrent_ul_rate_threshold"
				label="Slow torrents upload rate threshold"
				isDisabled={!dontCountSlowTorrentsEnabledState}
				defaultValue={slow_torrent_ul_rate_threshold?.toString()}
				endContent={<p className="text-nowrap">KiB/s</p>}
				type="number"
			/>
			<Input
				name="slow_torrent_inactive_timer"
				label="Slow torrents inactivity time"
				isDisabled={!dontCountSlowTorrentsEnabledState}
				defaultValue={slow_torrent_inactive_timer?.toString()}
				endContent={<p className="text-nowrap">seconds</p>}
				type="number"
			/>
			<Divider className="my-2" />

			<Select name="max_ratio_act" label="Seeding action" defaultSelectedKeys={max_ratio_act !== undefined ? new Set([max_ratio_act.toString()]) : new Set()}>
				<SelectItem key={QBittorrentPreferencesMaxRatioAct.STOP_TORRENT.toString()}>Stop torrent</SelectItem>
				<SelectItem key={QBittorrentPreferencesMaxRatioAct.REMOVE_TORRENT.toString()}>Remove torrent</SelectItem>
				<SelectItem key={QBittorrentPreferencesMaxRatioAct.REMOVE_TORRENT_AND_FILES.toString()}>Remove torrent & files</SelectItem>
				<SelectItem key={QBittorrentPreferencesMaxRatioAct.ENABLE_SUPER_SEEDING.toString()}>Enable super seeding</SelectItem>
			</Select>
			<Checkbox name="max_ratio_enabled" isSelected={maxRatioEnabledState} onValueChange={setMaxRatioEnabledState}>Execute seeding action when ratio reaches</Checkbox>
			<Input
				name="max_ratio"
				label="Ratio trigger value"
				isDisabled={!maxRatioEnabledState}
				defaultValue={max_ratio?.toString()}
				type="number"
			/>
			<Checkbox name="max_seeding_time_enabled" isSelected={maxSeedingTimeEnabledState} onValueChange={setMaxSeedingTimeEnabledState}>Execute seeding action when seeding time reaches</Checkbox>
			<Input
				name="max_seeding_time"
				label="Seeding time trigger value"
				isDisabled={!maxSeedingTimeEnabledState}
				defaultValue={max_seeding_time?.toString()}
				type="number"
				endContent={<p className="text-nowrap">minutes</p>}
			/>
			<Checkbox name="max_inactive_seeding_time_enabled" isSelected={maxInactiveSeedingTimeEnabledState} onValueChange={setMaxInactiveSeedingTimeEnabledState}>Execute seeding action when inactive seeding time reaches</Checkbox>
			<Input
				name="max_inactive_seeding_time"
				label="Inactive seeding time trigger value"
				isDisabled={!maxInactiveSeedingTimeEnabledState}
				defaultValue={max_inactive_seeding_time?.toString()}
				type="number"
				endContent={<p className="text-nowrap">minutes</p>}
			/>
			<Divider className="my-2" />

			<Checkbox name="add_trackers_enabled" isSelected={addTrackersEnabledState} onValueChange={setAddTrackersEnabledState}>Automatically append these trackers to new downloads</Checkbox>
			<Textarea name="add_trackers" label="Trackers URLs (1 per line)" isDisabled={!addTrackersEnabledState} defaultValue={add_trackers} />
		</>
	)
})
