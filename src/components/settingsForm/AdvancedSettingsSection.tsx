import type { Selection } from '@heroui/react'
import { useGetNetworkAddresses } from '@/api/useGetNetworkAddresses'
import { useGetNetworkInterfaces } from '@/api/useGetNetworkInterfaces'
import {
	type QBittorrentPreferences,
	QBittorrentPreferencesDiskIOType,
	QBittorrentPreferencesDiskReadMode,
	QBittorrentPreferencesDiskWriteMode,
	QBittorrentPreferencesUploadChockingAlgorithm,
	QBittorrentPreferencesUploadSlotsBehavior,
	QBittorrentPreferencesUTPTCPMixedMode,
} from '@/types/QBittorrentPreferences'
import { Checkbox, Divider, Input, Link, Select, SelectItem } from '@heroui/react'
import { IconExternalLink } from '@tabler/icons-react'
import { memo, useCallback, useEffect, useState } from 'react'

export const AdvancedSettingsSection = memo(
	({
		resume_data_storage_type,
		torrent_content_remove_option,
		memory_working_set_limit,
		current_network_interface,
		current_interface_address,
		save_resume_data_interval,
		torrent_file_size_limit,
		recheck_completed_torrents,
		app_instance_name,
		refresh_interval,
		resolve_peer_countries,
		reannounce_when_address_changed,
		enable_embedded_tracker,
		embedded_tracker_port,
		embedded_tracker_port_forwarding,
		ignore_ssl_errors,
		python_executable_path,
		bdecode_depth_limit,
		bdecode_token_limit,
		async_io_threads,
		hashing_threads,
		file_pool_size,
		checking_memory_use,
		disk_queue_size,
		disk_io_type,
		disk_io_read_mode,
		disk_io_write_mode,
		enable_piece_extent_affinity,
		enable_upload_suggestions,
		send_buffer_watermark,
		send_buffer_low_watermark,
		send_buffer_watermark_factor,
		connection_speed,
		outgoing_ports_min,
		outgoing_ports_max,
		peer_tos,
		utp_tcp_mixed_mode,
		idn_support_enabled,
		enable_multi_connections_from_same_ip,
		validate_https_tracker_certificate,
		ssrf_mitigation,
		block_peers_on_privileged_ports,
		upload_slots_behavior,
		upload_choking_algorithm,
		announce_to_all_trackers,
		announce_to_all_tiers,
		announce_ip,
		max_concurrent_http_announces,
		stop_tracker_timeout,
		peer_turnover,
		peer_turnover_cutoff,
		peer_turnover_interval,
		request_queue_size,
	}: Pick<
		QBittorrentPreferences,
		| 'resume_data_storage_type'
		| 'torrent_content_remove_option'
		| 'memory_working_set_limit'
		| 'current_network_interface'
		| 'current_interface_address'
		| 'save_resume_data_interval'
		| 'torrent_file_size_limit'
		| 'recheck_completed_torrents'
		| 'app_instance_name'
		| 'refresh_interval'
		| 'resolve_peer_countries'
		| 'reannounce_when_address_changed'
		| 'enable_embedded_tracker'
		| 'embedded_tracker_port'
		| 'embedded_tracker_port_forwarding'
		| 'ignore_ssl_errors'
		| 'python_executable_path'
		| 'bdecode_depth_limit'
		| 'bdecode_token_limit'
		| 'async_io_threads'
		| 'hashing_threads'
		| 'file_pool_size'
		| 'checking_memory_use'
		| 'disk_queue_size'
		| 'disk_io_type'
		| 'disk_io_read_mode'
		| 'disk_io_write_mode'
		| 'enable_piece_extent_affinity'
		| 'enable_upload_suggestions'
		| 'send_buffer_watermark'
		| 'send_buffer_low_watermark'
		| 'send_buffer_watermark_factor'
		| 'connection_speed'
		| 'outgoing_ports_min'
		| 'outgoing_ports_max'
		| 'peer_tos'
		| 'utp_tcp_mixed_mode'
		| 'idn_support_enabled'
		| 'enable_multi_connections_from_same_ip'
		| 'validate_https_tracker_certificate'
		| 'ssrf_mitigation'
		| 'block_peers_on_privileged_ports'
		| 'upload_slots_behavior'
		| 'upload_choking_algorithm'
		| 'announce_to_all_trackers'
		| 'announce_to_all_tiers'
		| 'announce_ip'
		| 'max_concurrent_http_announces'
		| 'stop_tracker_timeout'
		| 'peer_turnover'
		| 'peer_turnover_cutoff'
		| 'peer_turnover_interval'
		| 'request_queue_size'
	>) => {
		const [getNetowkInterfaces, isNetworkInterfacesLoading] = useGetNetworkInterfaces()
		const [networkInterfacesList, setNetworkInterfacesList] = useState<Array<{ name: string; value: string }>>(
			current_network_interface ? [{ name: current_network_interface, value: current_network_interface }] : []
		)
		const [getNetowkAddresses, isNetworkAddressesLoading] = useGetNetworkAddresses()
		const [networkAddressesList, setNetworkAddressesList] = useState<Array<string>>([])
		const [selectedNetworkInterface, setSelectedNetworkInterface] = useState<Selection>(
			current_network_interface !== undefined ? new Set([current_network_interface]) : new Set()
		)
		const [embeddedTrackerEnabledState, setEmbeddedTrackedEnabledState] = useState(enable_embedded_tracker)

		const refreshNetworkInterfaces = useCallback(async () => {
			const interfaces = await getNetowkInterfaces()
			setNetworkInterfacesList(interfaces)
		}, [getNetowkInterfaces])
		useEffect(() => {
			refreshNetworkInterfaces()
		}, [refreshNetworkInterfaces])

		const refreshNetworkAddresses = useCallback(async () => {
			if (selectedNetworkInterface && selectedNetworkInterface !== 'all') {
				const value = selectedNetworkInterface.values().next().value
				if (value) {
					const addresses = await getNetowkAddresses(value.toString())
					setNetworkAddressesList(addresses)
					return
				}
			}
			setNetworkAddressesList([])
		}, [getNetowkAddresses, selectedNetworkInterface])
		useEffect(() => {
			refreshNetworkAddresses()
		}, [refreshNetworkAddresses])

		return (
			<>
				<Select
					name="resume_data_storage_type"
					label="Resume data storage type (requires restart)"
					defaultSelectedKeys={resume_data_storage_type !== undefined ? new Set([resume_data_storage_type]) : new Set()}
				>
					<SelectItem key="Legacy">Fastresume files</SelectItem>
					<SelectItem key="SQLite">SQLite database (experimental)</SelectItem>
				</Select>
				<Select
					name="torrent_content_remove_option"
					label="Torrent content removing mode"
					defaultSelectedKeys={torrent_content_remove_option !== undefined ? new Set([torrent_content_remove_option]) : new Set()}
				>
					<SelectItem key="Delete">Delete files permanently</SelectItem>
					<SelectItem key="MoveToTrash">Move files to trash (if possible)</SelectItem>
				</Select>
				<Input
					name="memory_working_set_limit"
					label="Physical memory (RAM) usage limit"
					defaultValue={memory_working_set_limit?.toString()}
					type="number"
					endContent={<p className="text-nowrap">MiB</p>}
				/>
				<Select
					name="current_network_interface"
					label="Network interface"
					isLoading={isNetworkInterfacesLoading}
					disallowEmptySelection
					items={networkInterfacesList}
					selectedKeys={selectedNetworkInterface}
					onSelectionChange={setSelectedNetworkInterface}
				>
					{({ name, value }) => <SelectItem key={value}>{name}</SelectItem>}
				</Select>
				<Select
					name="current_interface_address"
					label="Optional IP address to bind to"
					isLoading={isNetworkAddressesLoading}
					disallowEmptySelection
					defaultSelectedKeys={current_interface_address !== undefined ? new Set([current_interface_address]) : new Set()}
				>
					{[
						<SelectItem key="">All addresses</SelectItem>,
						<SelectItem key="0.0.0.0">All IPv4 addresses</SelectItem>,
						<SelectItem key="::">All IPv6 addresses</SelectItem>,
					].concat((networkAddressesList || []).map((value) => <SelectItem key={value}>{value}</SelectItem>))}
				</Select>
				<Input
					name="save_resume_data_interval"
					label="Save resume data interval"
					defaultValue={save_resume_data_interval?.toString()}
					type="number"
					endContent={<p className="text-nowrap">minutes</p>}
				/>
				<Input
					name="torrent_file_size_limit"
					label=".torrent file size limit"
					defaultValue={torrent_file_size_limit?.toString()}
					type="number"
					endContent={<p className="text-nowrap">bytes</p>}
				/>
				<Checkbox name="recheck_completed_torrents" defaultSelected={recheck_completed_torrents}>
					Recheck torrents on completion
				</Checkbox>
				<Input name="app_instance_name" label="Customize application instance name" defaultValue={app_instance_name} />
				<Input
					name="refresh_interval"
					label="Refresh interval"
					defaultValue={refresh_interval?.toString()}
					type="number"
					endContent={<p className="text-nowrap">milliseconds</p>}
				/>
				<Checkbox name="resolve_peer_countries" defaultSelected={resolve_peer_countries}>
					Resolve peer countries
				</Checkbox>
				<Checkbox name="reannounce_when_address_changed" defaultSelected={reannounce_when_address_changed}>
					Reannounce to all trackers when IP or port changed
				</Checkbox>
				<Checkbox
					name="enable_embedded_tracker"
					isSelected={embeddedTrackerEnabledState}
					onValueChange={setEmbeddedTrackedEnabledState}
				>
					Enable embedded tracker
				</Checkbox>
				<Input
					name="embedded_tracker_port"
					label="Embedded tracker port"
					isDisabled={!embeddedTrackerEnabledState}
					defaultValue={embedded_tracker_port?.toString()}
					type="number"
				/>
				<Checkbox name="embedded_tracker_port_forwarding" defaultSelected={embedded_tracker_port_forwarding}>
					Enable port forwarding for embedded tracker
				</Checkbox>
				<Checkbox name="ignore_ssl_errors" defaultSelected={ignore_ssl_errors}>
					Ignore SSL errors
				</Checkbox>
				<Input
					name="python_executable_path"
					label="Python executable path (may require restart)"
					placeholder="Auto detect if empty"
					defaultValue={python_executable_path?.toString()}
				/>
				<Divider className="my-2" />

				<Input
					name="bdecode_depth_limit"
					label="Bdecode depth limit"
					defaultValue={bdecode_depth_limit?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Bdecoding.html#bdecode()"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="bdecode_token_limit"
					label="Bdecode token limit"
					defaultValue={bdecode_token_limit?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Bdecoding.html#bdecode()"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="async_io_threads"
					label="Asynchronous I/O threads"
					defaultValue={async_io_threads?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#aio_threads"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="hashing_threads"
					label="Hashing threads"
					defaultValue={hashing_threads?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#hashing_threads"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="file_pool_size"
					label="File pool size"
					defaultValue={file_pool_size?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#file_pool_size"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="checking_memory_use"
					label="Outstanding memory when checking torrents"
					defaultValue={checking_memory_use?.toString()}
					type="number"
					endContent={
						<>
							<p className="text-nowrap mr-1">MiB</p>
							<Link
								href="https://www.libtorrent.org/reference-Settings.html#checking_mem_usage"
								target="_blank"
								referrerPolicy="no-referrer"
							>
								<IconExternalLink />
							</Link>
						</>
					}
				/>
				<Input
					name="disk_queue_size"
					label="Disk queue size"
					defaultValue={disk_queue_size?.toString()}
					type="number"
					endContent={
						<>
							<p className="text-nowrap mr-1">Bytes</p>
							<Link
								href="https://www.libtorrent.org/reference-Settings.html#max_queued_disk_bytes"
								target="_blank"
								referrerPolicy="no-referrer"
							>
								<IconExternalLink />
							</Link>
						</>
					}
				/>
				<Select
					name="disk_io_type"
					label="Disk IO type (requires restart)"
					defaultSelectedKeys={disk_io_type !== undefined ? new Set([disk_io_type.toString()]) : new Set()}
					endContent={
						<Link
							href="https://www.libtorrent.org/single-page-ref.html#default-disk-io-constructor"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				>
					<SelectItem key={QBittorrentPreferencesDiskIOType.DEFAULT.toString()}>Default</SelectItem>
					<SelectItem key={QBittorrentPreferencesDiskIOType.MMAP_FILES.toString()}>Memory mapped files</SelectItem>
					<SelectItem key={QBittorrentPreferencesDiskIOType.POSIX.toString()}>POSIX-compliant</SelectItem>
					<SelectItem key={QBittorrentPreferencesDiskIOType.PREAD_PWRITE.toString()}>Simple pread/pwrite</SelectItem>
				</Select>
				<Select
					name="disk_io_read_mode"
					label="Disk IO read mode"
					defaultSelectedKeys={disk_io_read_mode !== undefined ? new Set([disk_io_read_mode.toString()]) : new Set()}
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#disk_io_read_mode"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				>
					<SelectItem key={QBittorrentPreferencesDiskReadMode.DISABLE_OS_CACHE.toString()}>Disable OS cache</SelectItem>
					<SelectItem key={QBittorrentPreferencesDiskReadMode.ENABLE_OS_CACHE.toString()}>Enable OS cache</SelectItem>
				</Select>
				<Select
					name="disk_io_write_mode"
					label="Disk IO read mode"
					defaultSelectedKeys={disk_io_write_mode !== undefined ? new Set([disk_io_write_mode.toString()]) : new Set()}
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#disk_io_read_mode"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				>
					<SelectItem key={QBittorrentPreferencesDiskWriteMode.DISABLE_OS_CACHE.toString()}>Disable OS cache</SelectItem>
					<SelectItem key={QBittorrentPreferencesDiskWriteMode.ENABLE_OS_CACHE.toString()}>Enable OS cache</SelectItem>
				</Select>
				<div className="flex gap-1">
					<Checkbox name="enable_piece_extent_affinity" defaultSelected={enable_piece_extent_affinity}>
						Use piece extent affinity
					</Checkbox>
					<Link
						href="https://libtorrent.org/single-page-ref.html#piece_extent_affinity"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						<IconExternalLink />
					</Link>
				</div>
				<div className="flex gap-1">
					<Checkbox name="enable_upload_suggestions" defaultSelected={enable_upload_suggestions}>
						Send upload piece suggestions
					</Checkbox>
					<Link
						href="https://www.libtorrent.org/reference-Settings.html#suggest_mode"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						<IconExternalLink />
					</Link>
				</div>
				<Input
					name="send_buffer_watermark"
					label="Send buffer watermark"
					defaultValue={send_buffer_watermark?.toString()}
					type="number"
					endContent={
						<>
							<p className="text-nowrap mr-1">KiB</p>
							<Link
								href="https://www.libtorrent.org/reference-Settings.html#send_buffer_watermark"
								target="_blank"
								referrerPolicy="no-referrer"
							>
								<IconExternalLink />
							</Link>
						</>
					}
				/>
				<Input
					name="send_buffer_low_watermark"
					label="Send buffer low watermark"
					defaultValue={send_buffer_low_watermark?.toString()}
					type="number"
					endContent={
						<>
							<p className="text-nowrap mr-1">KiB</p>
							<Link
								href="https://www.libtorrent.org/reference-Settings.html#send_buffer_low_watermark"
								target="_blank"
								referrerPolicy="no-referrer"
							>
								<IconExternalLink />
							</Link>
						</>
					}
				/>
				<Input
					name="send_buffer_watermark_factor"
					label="Send buffer watermark factor"
					defaultValue={send_buffer_watermark_factor?.toString()}
					type="number"
					endContent={
						<>
							<p className="text-nowrap mr-1">%</p>
							<Link
								href="https://www.libtorrent.org/reference-Settings.html#send_buffer_watermark_factor"
								target="_blank"
								referrerPolicy="no-referrer"
							>
								<IconExternalLink />
							</Link>
						</>
					}
				/>
				<Input
					name="connection_speed"
					label="Outgoing connections per second"
					defaultValue={connection_speed?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#send_buffer_watermark_factor"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="outgoing_ports_min"
					label="Minimal outgoing ports (0 for disabled)"
					defaultValue={outgoing_ports_min?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#outgoing_port"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="outgoing_ports_max"
					label="Maximal outgoing ports (0 for disabled)"
					defaultValue={outgoing_ports_max?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#outgoing_port"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="peer_tos"
					label="Type of service (ToS) for connections to peers"
					defaultValue={peer_tos?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#peer_dscp"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Select
					name="utp_tcp_mixed_mode"
					label="μTP-TCP mixed mode algorithm"
					defaultSelectedKeys={utp_tcp_mixed_mode !== undefined ? new Set([utp_tcp_mixed_mode.toString()]) : new Set()}
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#mixed_mode_algorithm"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				>
					<SelectItem key={QBittorrentPreferencesUTPTCPMixedMode.PREFER_TCP.toString()}>Prefer TCP</SelectItem>
					<SelectItem key={QBittorrentPreferencesUTPTCPMixedMode.PEER_PROPORTIONAL.toString()}>
						Peer proportional (throttles TCP)
					</SelectItem>
				</Select>
				<div className="flex gap-1">
					<Checkbox name="idn_support_enabled" defaultSelected={idn_support_enabled}>
						Support internationalized domain name (IDN)
					</Checkbox>
					<Link href="https://www.libtorrent.org/reference-Settings.html#allow_idna" target="_blank" referrerPolicy="no-referrer">
						<IconExternalLink />
					</Link>
				</div>
				<div className="flex gap-1">
					<Checkbox name="enable_multi_connections_from_same_ip" defaultSelected={enable_multi_connections_from_same_ip}>
						Allow multiple connections from the same IP address
					</Checkbox>
					<Link
						href="https://www.libtorrent.org/reference-Settings.html#allow_multiple_connections_per_ip"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						<IconExternalLink />
					</Link>
				</div>
				<div className="flex gap-1">
					<Checkbox name="validate_https_tracker_certificate" defaultSelected={validate_https_tracker_certificate}>
						Validate HTTPS tracker certificate
					</Checkbox>
					<Link
						href="https://www.libtorrent.org/reference-Settings.html#validate_https_trackers"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						<IconExternalLink />
					</Link>
				</div>
				<div className="flex gap-1">
					<Checkbox name="ssrf_mitigation" defaultSelected={ssrf_mitigation}>
						Server-side request forgery (SSRF) mitigation
					</Checkbox>
					<Link
						href="https://www.libtorrent.org/reference-Settings.html#ssrf_mitigation"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						<IconExternalLink />
					</Link>
				</div>
				<div className="flex gap-1">
					<Checkbox name="block_peers_on_privileged_ports" defaultSelected={block_peers_on_privileged_ports}>
						Disallow connection to peers on privileged ports
					</Checkbox>
					<Link
						href="https://libtorrent.org/single-page-ref.html#no_connect_privileged_ports"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						<IconExternalLink />
					</Link>
				</div>
				<Select
					name="upload_slots_behavior"
					label="Upload slots behavior"
					defaultSelectedKeys={upload_slots_behavior !== undefined ? new Set([upload_slots_behavior.toString()]) : new Set()}
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#choking_algorithm"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				>
					<SelectItem key={QBittorrentPreferencesUploadSlotsBehavior.FIXED_SLOTS.toString()}>Fixed sots</SelectItem>
					<SelectItem key={QBittorrentPreferencesUploadSlotsBehavior.UPLOAD_RATE_BASED.toString()}>Upload rate based</SelectItem>
				</Select>
				<Select
					name="upload_choking_algorithm"
					label="Upload slots behavior"
					defaultSelectedKeys={
						upload_choking_algorithm !== undefined ? new Set([upload_choking_algorithm.toString()]) : new Set()
					}
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#seed_choking_algorithm"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				>
					<SelectItem key={QBittorrentPreferencesUploadChockingAlgorithm.ROUND_ROBIN.toString()}>Round-robin</SelectItem>
					<SelectItem key={QBittorrentPreferencesUploadChockingAlgorithm.FASTEST_UPLOAD.toString()}>Fastest upload</SelectItem>
					<SelectItem key={QBittorrentPreferencesUploadChockingAlgorithm.ANTI_LEECH.toString()}>Anti-leech</SelectItem>
				</Select>
				<div className="flex gap-1">
					<Checkbox name="announce_to_all_trackers" defaultSelected={announce_to_all_trackers}>
						Always announce to all trackers in a tier
					</Checkbox>
					<Link
						href="https://www.libtorrent.org/reference-Settings.html#announce_to_all_trackers"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						<IconExternalLink />
					</Link>
				</div>
				<div className="flex gap-1">
					<Checkbox name="announce_to_all_tiers" defaultSelected={announce_to_all_tiers}>
						Always announce to all tiers
					</Checkbox>
					<Link
						href="https://www.libtorrent.org/reference-Settings.html#announce_to_all_tiers"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						<IconExternalLink />
					</Link>
				</div>
				<Input
					name="announce_ip"
					label="IP address reported to trackers (requires restart)"
					defaultValue={announce_ip}
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#announce_ip"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="max_concurrent_http_announces"
					label="Max concurrent HTTP announces"
					defaultValue={max_concurrent_http_announces?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#max_concurrent_http_announces"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="stop_tracker_timeout"
					label="Stop tracker timeout (0 for disabled)"
					defaultValue={stop_tracker_timeout?.toString()}
					type="number"
					endContent={
						<>
							<p className="text-nowrap">seconds</p>
							<Link
								href="https://www.libtorrent.org/reference-Settings.html#stop_tracker_timeout"
								target="_blank"
								referrerPolicy="no-referrer"
							>
								<IconExternalLink />
							</Link>
						</>
					}
				/>
				<Input
					name="peer_turnover"
					label="Peer turnover disconnect percentage"
					defaultValue={peer_turnover?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#peer_turnover"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="peer_turnover_cutoff"
					label="Peer turnover threshold percentage"
					defaultValue={peer_turnover_cutoff?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#peer_turnover"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
				<Input
					name="peer_turnover_interval"
					label="Peer turnover disconnect interval"
					defaultValue={peer_turnover_interval?.toString()}
					type="number"
					endContent={
						<>
							<p className="text-nowrap">seconds</p>
							<Link
								href="https://www.libtorrent.org/reference-Settings.html#peer_turnove"
								target="_blank"
								referrerPolicy="no-referrer"
							>
								<IconExternalLink />
							</Link>
						</>
					}
				/>
				<Input
					name="request_queue_size"
					label="Maximum outstanding requests to a single peer"
					defaultValue={request_queue_size?.toString()}
					type="number"
					endContent={
						<Link
							href="https://www.libtorrent.org/reference-Settings.html#max_out_request_queue"
							target="_blank"
							referrerPolicy="no-referrer"
						>
							<IconExternalLink />
						</Link>
					}
				/>
			</>
		)
	}
)
