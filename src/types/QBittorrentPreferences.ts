export interface QBittorrentPreferences {
	add_stopped_enabled?: boolean // ✅ Do not start the download automatically
	add_to_top_of_queue?: boolean // ✅ Add torrent to top of queue by default
	add_trackers?: string // ✅ List of trackers to add to new torrent
	add_trackers_enabled?: boolean // ✅ Enable automatic adding of trackers to new torrents
	alt_dl_limit?: number // ✅ Alternative global download speed limit in KiB/s
	alt_up_limit?: number // ✅ Alternative global upload speed limit in KiB/s
	alternative_webui_enabled?: boolean // ✅ True if an alternative WebUI should be used
	alternative_webui_path?: string // ✅ File path to the alternative WebUI
	announce_ip?: string // ✅ IP address reported to trackers (requires restart)
	announce_to_all_tiers?: boolean // ✅ True always announce to all tiers
	announce_to_all_trackers?: boolean // ✅ True always announce to all trackers in a tier
	anonymous_mode?: boolean // ✅ If true anonymous mode will be enabled; read more here; this option is only available in qBittorent built against libtorrent version 0.16.X and higher
	app_instance_name?: string // ✅ Customize application instance name
	async_io_threads?: number // ✅ Number of asynchronous I / O threads
	auto_delete_mode?: 0 | 1 // ✅ Delete .torrents files after download complete, 0 = false 1 = true
	auto_tmm_enabled?: boolean // ✅ True if Automatic Torrent Management is enabled by default
	autorun_enabled?: boolean // ✅ True if external program should be run after torrent has finished downloading
	autorun_on_torrent_added_enabled?: boolean // ✅ Run external program on torrent added
	autorun_on_torrent_added_program?: string // ✅ Command line to run on torrent added
	autorun_program?: string // ✅ Program path / name / arguments to run if autorun_enabled is enabled; path is separated by slashes; you can use % f and % n arguments, which will be expanded by qBittorent as path_to_torrent_file and torrent_name(from the GUI; not the.torrent file name) respectively
	banned_IPs?: string // ✅ List of banned IPs
	bdecode_depth_limit?: number // ✅ Bdecode depth limit
	bdecode_token_limit?: number // ✅ Bdecode token limit
	bittorrent_protocol?: QBittorrentPreferencesBittorrentProtocol // ✅ Bittorrent Protocol to use(see list of possible values below)
	block_peers_on_privileged_ports?: boolean // ✅ Disallow connection to peers on privileged ports
	bypass_auth_subnet_whitelist?: string // ✅ (White)list of ipv4 / ipv6 subnets for which webui authentication should be bypassed; list entries are separated by commas
	bypass_auth_subnet_whitelist_enabled?: boolean // ✅ True if webui authentication should be bypassed for clients whose ip resides within(at least) one of the subnets on the whitelist
	bypass_local_auth?: boolean // ✅ True if authentication challenge for loopback address(127.0.0.1) should be disabled
	category_changed_tmm_enabled?: boolean // ✅ True if torrent should be relocated when its Category's save path changes
	checking_memory_use?: number // ✅ Outstanding memory when checking torrents in MiB
	connection_speed?: number // ✅ Outgoing connections per second
	create_subfolder_enabled?: boolean // True if a subfolder should be created when adding a torrent
	current_interface_address?: string // ✅ IP Address to bind to.Empty String means All addresses
	current_interface_name?: string // Undocumented
	current_network_interface?: string // ✅ Network Interface used
	delete_torrent_content_files?: boolean // Undocumented
	dht?: boolean // ✅ True if DHT is enabled
	dht_bootstrap_nodes?: string // ✅ Undocumented, comma separated value
	disk_cache?: number // Disk cache used in MiB
	disk_cache_ttl?: number // Disk cache expiry interval in seconds
	disk_io_read_mode?: QBittorrentPreferencesDiskReadMode // ✅ Undocumented
	disk_io_type?: QBittorrentPreferencesDiskIOType // ✅ Undocumented
	disk_io_write_mode?: QBittorrentPreferencesDiskWriteMode // ✅ Undocumented
	disk_queue_size?: number // ✅ Undocumented
	dl_limit?: number // Global download speed limit in KiB / s; -1 means no limit is applied
	dont_count_slow_torrents?: boolean // ✅ If true torrents w / o any activity(stalled ones) will not be counted towards max_active_ * limits; see dont_count_slow_torrents for more information
	dyndns_domain?: string // ✅ Your DDNS domain name
	dyndns_enabled?: boolean // ✅ True if server DNS should be updated dynamically
	dyndns_password?: string // ✅ Password for DDNS service
	dyndns_service?: QBittorrentPreferencesDYNDNSService // ✅ See list of possible values here below
	dyndns_username?: string // ✅ Username for DDNS service
	embedded_tracker_port?: number // ✅ Port used for embedded tracker
	embedded_tracker_port_forwarding?: boolean // ✅ Undocumented
	enable_coalesce_read_write?: boolean // True enables coalesce reads & writes
	enable_embedded_tracker?: boolean // True enables embedded tracker
	enable_multi_connections_from_same_ip?: boolean // ✅ True allows multiple connections from the same IP address
	enable_os_cache?: boolean // True enables os cache
	enable_piece_extent_affinity?: boolean // ✅ True if the advanced libtorrent option piece_extent_affinity is enabled
	enable_upload_suggestions?: boolean // ✅ True enables sending of upload piece suggestions
	encryption?: QBittorrentPreferencesEncryptionMode // ✅ See list of possible values here below
	exclude_file_names?: string // Undocumented
	exclude_file_names_enabled?: boolean // Undocumented
	export_dir?: string // Path to directory to copy.torrent files to.Slashes are used as path separators
	export_dir_fin?: string // Path to directory to copy.torrent files of completed downloads to.Slashes are used as path separators
	file_log_age?: number // Undocumented
	file_log_age_type?: QBittorrentPreferencesFileLogAgeType // ✅ Undocumented
	file_log_backup_enabled?: boolean // Undocumented
	file_log_delete_old?: boolean // Undocumented
	file_log_enabled?: boolean // Undocumented
	file_log_max_size?: number // Undocumented
	file_log_path?: string // Undocumented
	file_pool_size?: number // ✅ File pool size
	hashing_threads?: number // ✅
	i2p_address?: string
	i2p_enabled?: boolean
	i2p_inbound_length?: number
	i2p_inbound_quantity?: number
	i2p_mixed_mode?: boolean
	i2p_outbound_length?: number
	i2p_outbound_quantity?: number
	i2p_port?: number
	idn_support_enabled?: boolean // ✅
	ignore_ssl_errors?: boolean // ✅
	incomplete_files_ext?: boolean // True if ".!qB" should be appended to incomplete files
	ip_filter_enabled?: boolean // True if external IP filter should be enabled
	ip_filter_path?: string // Path to IP filter file(.dat, .p2p, .p2b files are supported); path is separated by slashes
	ip_filter_trackers?: boolean // True if IP filters are applied to trackers
	limit_lan_peers?: boolean // True if [du]l_limit should be applied to peers on the LAN
	limit_tcp_overhead?: boolean // True if [du]l_limit should be applied to estimated TCP overhead(service data: e.g.packet headers)
	limit_utp_rate?: boolean // True if [du]l_limit should be applied to uTP connections; this option is only available in qBittorent built against libtorrent version 0.16.X and higher
	listen_port?: number // ✅ Port for incoming connections
	locale?: string // ✅ Currently selected language (e.g. en_GB for English)
	lsd?: boolean // ✅ True if LSD is enabled
	mail_notification_auth_enabled?: boolean // True if smtp server requires authentication
	mail_notification_email?: string // e - mail to send notifications to
	mail_notification_enabled?: boolean // True if e - mail notification should be enabled
	mail_notification_password?: string // Password for smtp authentication
	mail_notification_sender?: string // e - mail where notifications should originate from
	mail_notification_smtp?: string // smtp server for e - mail notifications
	mail_notification_ssl_enabled?: boolean // True if smtp server requires SSL connection
	mail_notification_username?: string // Username for smtp authentication
	mark_of_the_web?: boolean
	max_active_checking_torrents?: number // ✅
	max_active_downloads?: number // ✅ Maximum number of active simultaneous downloads
	max_active_torrents?: number // ✅ Maximum number of active simultaneous downloads and uploads
	max_active_uploads?: number // ✅ Maximum number of active simultaneous uploads
	max_concurrent_http_announces?: number // ✅
	max_connec?: number // Maximum global number of simultaneous connections
	max_connec_per_torrent?: number // Maximum number of simultaneous connections per torrent
	max_inactive_seeding_time?: number // ✅
	max_inactive_seeding_time_enabled?: boolean // ✅
	max_ratio?: number // Get the global share ratio limit
	max_ratio_act?: QBittorrentPreferencesMaxRatioAct // ✅ Action performed when a torrent reaches the maximum share ratio.See list of possible values here below.
	max_ratio_enabled?: boolean // ✅ True if share ratio limit is enabled
	max_seeding_time?: number // ✅ Number of minutes to seed a torrent
	max_seeding_time_enabled?: boolean // ✅ True enables max seeding time
	max_uploads?: number // Maximum number of upload slots
	max_uploads_per_torrent?: number // Maximum number of upload slots per torrent
	memory_working_set_limit?: number
	merge_trackers?: boolean
	outgoing_ports_max?: number // ✅ Maximal outgoing port(0: Disabled)
	outgoing_ports_min?: number // ✅ Minimal outgoing port(0: Disabled)
	peer_tos?: number // ✅
	peer_turnover?: number // ✅
	peer_turnover_cutoff?: number // ✅
	peer_turnover_interval?: number // ✅
	performance_warning?: boolean
	pex?: boolean // ✅ True if PeX is enabled
	preallocate_all?: boolean // True if disk space should be pre-allocated for all files
	proxy_auth_enabled?: boolean // True proxy requires authentication; doesn't apply to SOCKS4 proxies
	proxy_bittorrent?: boolean
	proxy_hostname_lookup?: boolean
	proxy_ip?: string // Proxy IP address or domain name
	proxy_misc?: boolean
	proxy_password?: string // Password for proxy authentication
	proxy_peer_connections?: boolean // True if peer and web seed connections should be proxified; this option will have any effect only in qBittorent built against libtorrent version 0.16.X and higher
	proxy_port?: number // Proxy port
	proxy_rss?: boolean
	proxy_torrents_only?: boolean // True if proxy is only used for torrents
	proxy_type?: 'None' | 'SOCKS4' | 'SOCKS5' | 'HTTP' // ✅ See list of possible values here below
	proxy_username?: string // Username for proxy authentication
	python_executable_path?: string // Undocumented
	queueing_enabled?: boolean // ✅ True if torrent queuing is enabled
	random_port?: boolean // True if the port is randomly selected
	reannounce_when_address_changed?: boolean // ✅
	recheck_completed_torrents?: boolean // ✅ True rechecks torrents on completion
	refresh_interval?: number // ✅
	request_queue_size?: number // ✅
	resolve_peer_countries?: boolean // ✅ True resolves peer countries
	resume_data_storage_type?: 'Legacy' | 'SQLite' // ✅
	rss_auto_downloading_enabled?: boolean // ✅ Enable auto - downloading of torrents from the RSS feeds
	rss_download_repack_proper_episodes?: boolean // ✅ For API ≥ v2.5.1: Enable downloading of repack / proper Episodes
	rss_fetch_delay?: number // ✅
	rss_max_articles_per_feed?: number // ✅ Max stored articles per RSS feed
	rss_processing_enabled?: boolean // ✅ Enable processing of RSS feeds
	rss_refresh_interval?: number // ✅ RSS refresh interval
	rss_smart_episode_filters?: string // ✅ For API ≥ v2.5.1: List of RSS Smart Episode Filters
	save_path?: string // Default save path for torrents, separated by slashes
	save_path_changed_tmm_enabled?: boolean // True if torrent should be relocated when the default save path changes
	save_resume_data_interval?: number // ✅ Save resume data interval in min
	scan_dirs?: QBittorrentPreferencesScanDirs // Property: directory to watch for torrent files, value: where torrents loaded from this directory should be downloaded to(see list of possible values below).Slashes are used as path separators; multiple key / value pairs can be specified
	schedule_from_hour?: number // ✅ Scheduler starting hour
	schedule_from_min?: number // ✅ Scheduler starting minute
	schedule_to_hour?: number // ✅ Scheduler ending hour
	schedule_to_min?: number // ✅ Scheduler ending minute
	scheduler_days?: QBittorrentPreferencesSchedulerDays // ✅ Scheduler days.See possible values here below
	scheduler_enabled?: boolean // ✅ True if alternative limits should be applied according to schedule
	send_buffer_low_watermark?: number // ✅ Send buffer low watermark in KiB
	send_buffer_watermark?: number // ✅ Send buffer watermark in KiB
	send_buffer_watermark_factor?: number // ✅ Send buffer watermark factor in percent
	slow_torrent_dl_rate_threshold?: number // ✅ Download rate in KiB / s for a torrent to be considered "slow"
	slow_torrent_inactive_timer?: number // ✅ Seconds a torrent should be inactive before considered "slow"
	slow_torrent_ul_rate_threshold?: number // ✅ Upload rate in KiB / s for a torrent to be considered "slow"
	socket_backlog_size?: number // Socket backlog size
	socket_receive_buffer_size?: number
	socket_send_buffer_size?: number
	ssl_enabled?: boolean
	ssl_listen_port?: number
	ssrf_mitigation?: boolean // ✅
	start_paused_enabled?: boolean // True if torrents should be added in a Paused state
	stop_tracker_timeout?: number // ✅ Timeout in seconds for a stopped announce request to trackers
	temp_path?: string // Path for incomplete torrents, separated by slashes
	temp_path_enabled?: boolean // True if folder for incomplete torrents is enabled
	torrent_changed_tmm_enabled?: boolean // True if torrent should be relocated when its Category changes
	torrent_content_layout?: string
	torrent_content_remove_option?: 'Delete' | 'MoveToTrash' // ✅
	torrent_file_size_limit?: number // ✅
	torrent_stop_condition?: string
	up_limit?: number // Global upload speed limit in KiB / s; -1 means no limit is applied
	upload_choking_algorithm?: QBittorrentPreferencesUploadChockingAlgorithm // ✅ Upload choking algorithm used(see list of possible values below)
	upload_slots_behavior?: QBittorrentPreferencesUploadSlotsBehavior // ✅ Upload slots behavior used(see list of possible values below)
	upnp?: boolean // ✅ True if UPnP / NAT - PMP is enabled
	upnp_lease_duration?: number // ✅ UPnP lease duration(0: Permanent lease)
	use_category_paths_in_manual_mode?: boolean
	use_https?: boolean // ✅ True if WebUI HTTPS access is enabled
	use_subcategories?: boolean
	use_unwanted_folder?: boolean
	utp_tcp_mixed_mode?: QBittorrentPreferencesUTPTCPMixedMode // ✅ μTP-TCP mixed mode algorithm (see list of possible values below)
	validate_https_tracker_certificate?: boolean // ✅
	web_ui_address?: string // ✅ IP address to use for the WebUI
	web_ui_ban_duration?: number // ✅ WebUI access ban duration in seconds
	web_ui_clickjacking_protection_enabled?: boolean // ✅ True if WebUI clickjacking protection is enabled
	web_ui_csrf_protection_enabled?: boolean // ✅ True if WebUI CSRF protection is enabled
	web_ui_custom_http_headers?: string // ✅ For API ≥ v2.5.1: List of custom http headers
	web_ui_domain_list?: string // ✅ Semicolon - separated list of domains to accept when performing Host header validation
	web_ui_host_header_validation_enabled?: boolean // ✅ True if WebUI host header validation is enabled
	web_ui_https_cert_path?: string // ✅ For API ≥ v2.0.1: Path to SSL certificate
	web_ui_https_key_path?: string // ✅ For API ≥ v2.0.1: Path to SSL keyfile
	web_ui_max_auth_fail_count?: number // ✅ Maximum number of authentication failures before WebUI access ban
	web_ui_port?: number // ✅ WebUI port
	web_ui_reverse_proxies_list?: string// ✅
	web_ui_reverse_proxy_enabled?: boolean // ✅
	web_ui_secure_cookie_enabled?: boolean // ✅ True if WebUI cookie Secure flag is enabled
	web_ui_session_timeout?: number // ✅ Seconds until WebUI is automatically signed off
	web_ui_upnp?: boolean // ✅ True if UPnP is used for the WebUI port
	web_ui_use_custom_http_headers_enabled?: boolean // ✅ For API ≥ v2.5.1: Enable custom http headers
	web_ui_username?: string // ✅ WebUI username
}
export type QBittorrentPreferencesInput = QBittorrentPreferences & {
	web_ui_password?: string // ✅ For API ≥ v2.3.0: Plaintext WebUI password
}

export enum QBittorrentPreferencesFileLogAgeType {
	DAYS = 0,
	MONTHS = 1,
	YEARS = 2,
}

export enum QBittorrentPreferencesDiskIOType {
	DEFAULT = 0,
	MMAP_FILES = 1,
	POSIX = 2,
	PREAD_PWRITE = 3,
}

export enum QBittorrentPreferencesDiskReadMode {
	DISABLE_OS_CACHE = 0,
	ENABLE_OS_CACHE = 1,
}

export enum QBittorrentPreferencesDiskWriteMode {
	DISABLE_OS_CACHE = 0,
	ENABLE_OS_CACHE = 1,
}

export enum QBittorrentPreferencesScanDirMode {
	DOWNLOAD_TO_MONITORED_FOLDER = 0,
	DOWNLOAD_TO_DEFAULT_SAVE_PATH = 1,
}
export type QBittorrentPreferencesScanDir = QBittorrentPreferencesScanDirMode | string
export type QBittorrentPreferencesScanDirs = Record<string, QBittorrentPreferencesScanDir>

export enum QBittorrentPreferencesSchedulerDays {
	EVERY_DAY = 0,
	EVERY_WEEKDAY = 1,
	EVERY_WEEKEND = 2,
	EVERY_MONDAY = 3,
	EVERY_TUESDAY = 4,
	EVERY_WEDNESDAY = 5,
	EVERY_THURSDAY = 6,
	EVERY_FRIDAY = 7,
	EVERY_SATURDAY = 8,
	EVERY_SUNDAY = 9,
}

export enum QBittorrentPreferencesEncryptionMode {
	PREFER_ENCRYPTION = 0,
	FORCE_ENCRYPTION_ON = 1,
	FORCE_ENCRYPTION_OFF = 2,
}

export enum QBittorrentPreferencesDYNDNSService {
	USE_DYDNS = 0,
	USE_NOIP = 1,
}

export enum QBittorrentPreferencesMaxRatioAct {
	STOP_TORRENT = 0,
	REMOVE_TORRENT = 1,
	ENABLE_SUPER_SEEDING = 2,
	REMOVE_TORRENT_AND_FILES = 3,
}

export enum QBittorrentPreferencesBittorrentProtocol {
	TCP_AND_UTP = 0,
	TCP = 1,
	UTP = 2,
}

export enum QBittorrentPreferencesUploadChockingAlgorithm {
	ROUND_ROBIN = 0,
	FASTEST_UPLOAD = 1,
	ANTI_LEECH = 2,
}

export enum QBittorrentPreferencesUploadSlotsBehavior {
	FIXED_SLOTS = 0,
	UPLOAD_RATE_BASED = 1,
}

export enum QBittorrentPreferencesUTPTCPMixedMode {
	PREFER_TCP = 0,
	PEER_PROPORTIONAL = 1,
}
