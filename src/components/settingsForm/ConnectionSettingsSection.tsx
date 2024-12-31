import { type QBittorrentPreferences, QBittorrentPreferencesBittorrentProtocol } from '@/types/QBittorrentPreferences'
import { Button, Checkbox, Divider, Input, Link, Select, SelectItem, Textarea } from '@nextui-org/react'
import { IconArrowsShuffle, IconExternalLink } from '@tabler/icons-react'
import { memo, useCallback, useState } from 'react'

export const ConnectionSettingsSection = memo(({
	bittorrent_protocol,
	listen_port,
	upnp,
	upnp_lease_duration,
	max_connec,
	max_connec_per_torrent,
	max_uploads,
	max_uploads_per_torrent,
	i2p_enabled,
	i2p_address,
	i2p_port,
	i2p_mixed_mode,
	i2p_inbound_quantity,
	i2p_outbound_quantity,
	i2p_inbound_length,
	i2p_outbound_length,
	proxy_type,
	proxy_ip,
	proxy_port,
	proxy_auth_enabled,
	proxy_username,
	proxy_password,
	proxy_hostname_lookup,
	proxy_bittorrent,
	proxy_peer_connections,
	proxy_rss,
	proxy_misc,
	ip_filter_enabled,
	ip_filter_path,
	ip_filter_trackers,
	banned_IPs,
}: Pick<
	QBittorrentPreferences,
	'bittorrent_protocol'
	| 'listen_port'
	| 'upnp'
	| 'upnp_lease_duration'
	| 'max_connec'
	| 'max_connec_per_torrent'
	| 'max_uploads'
	| 'max_uploads_per_torrent'
	| 'i2p_enabled'
	| 'i2p_address'
	| 'i2p_port'
	| 'i2p_mixed_mode'
	| 'i2p_inbound_quantity'
	| 'i2p_outbound_quantity'
	| 'i2p_inbound_length'
	| 'i2p_outbound_length'
	| 'proxy_type'
	| 'proxy_ip'
	| 'proxy_port'
	| 'proxy_auth_enabled'
	| 'proxy_username'
	| 'proxy_password'
	| 'proxy_hostname_lookup'
	| 'proxy_bittorrent'
	| 'proxy_peer_connections'
	| 'proxy_rss'
	| 'proxy_misc'
	| 'ip_filter_enabled'
	| 'ip_filter_path'
	| 'ip_filter_trackers'
	| 'banned_IPs'
>) => {
	const [listenPortState, setListenPortState] = useState(listen_port?.toString())
	const [upnpEnabledSate, setUpnpEnabledState] = useState(upnp)
	const [i2pEnabledState, setI2pEnabledState] = useState(i2p_enabled)
	const [proxyTypeState, setProxyTypeState] = useState(proxy_type)
	const [proxyAuthEnabledState, setProxyAuthEnabledState] = useState(proxy_auth_enabled)
	const [ipFilterEnabledState, setIpFilterEnabledState] = useState(ip_filter_enabled)

	const shuffleListenPort = useCallback(() => {
		const newValue = 15_000 + Math.floor(Math.random() * 60_000)
		setListenPortState(newValue.toString())
	}, [])

	return (
		<>
			<Select
				name="bittorrent_protocol"
				label="Peer connection protocol"
				defaultSelectedKeys={bittorrent_protocol !== undefined ? new Set([bittorrent_protocol?.toString()]) : []}
			>
				<SelectItem key={QBittorrentPreferencesBittorrentProtocol.TCP_AND_UTP}>TCP and μTP</SelectItem>
				<SelectItem key={QBittorrentPreferencesBittorrentProtocol.TCP}>TCP only</SelectItem>
				<SelectItem key={QBittorrentPreferencesBittorrentProtocol.UTP}>μTP only</SelectItem>
			</Select>
			<Divider className="my-2" />

			<Input
				name="listen_port"
				label="Port used for incoming connections"
				type="number"
				value={listenPortState}
				onValueChange={setListenPortState}
				endContent={<Button size="sm" variant="light" title="Use random port" onPress={shuffleListenPort} isIconOnly><IconArrowsShuffle width={20} /></Button>}
			/>
			<Checkbox name="upnp" isSelected={upnpEnabledSate} onValueChange={setUpnpEnabledState}>Use UPnP / NAT-PMP port forwarding from my router</Checkbox>
			<Input
				isDisabled={!upnpEnabledSate}
				color="warning"
				name="upnp_lease_duration"
				label="UPNP lease duration (0 for permanent)"
				type="number"
				defaultValue={upnp_lease_duration?.toString()}
				endContent={<Link color="warning" href="https://www.libtorrent.org/reference-Settings.html#upnp_lease_duration" target="_blank" referrerPolicy="no-referrer"><IconExternalLink /></Link>}
			/>
			<Divider className="my-2" />

			<Input
				name="max_connec"
				label="Maximum global number of simultaneous connections (-1 is unlimited)"
				type="number"
				defaultValue={max_connec?.toString()}
			/>
			<Input
				name="max_connec_per_torrent"
				label="Maximum number of simultaneous connections per torrent (-1 is unlimited)"
				type="number"
				defaultValue={max_connec_per_torrent?.toString()}
			/>
			<Input
				name="max_uploads"
				label="Maximum number of upload slots (-1 is unlimited)"
				type="number"
				defaultValue={max_uploads?.toString()}
			/>
			<Input
				name="max_uploads_per_torrent"
				label="Maximum number of upload slots per torrent (-1 is unlimited)"
				type="number"
				defaultValue={max_uploads_per_torrent?.toString()}
			/>
			<Divider className="my-2" />

			<Checkbox name="i2p_enabled" isSelected={i2pEnabledState} onValueChange={setI2pEnabledState}>I2P (Experimental)</Checkbox>
			<Input name="i2p_address" label="I2P Host" isDisabled={!i2pEnabledState} defaultValue={i2p_address} />
			<Input name="i2p_port" label="I2P Port" isDisabled={!i2pEnabledState} defaultValue={i2p_port?.toString()} type="number" />
			<Checkbox name="i2p_mixed_mode" isDisabled={!i2pEnabledState} defaultSelected={i2p_mixed_mode}>Use I2P mixed mode</Checkbox>
			<Input
				isDisabled={!i2pEnabledState}
				color="warning"
				name="i2p_inbound_quantity"
				label="I2P inbound quantity"
				type="number"
				defaultValue={i2p_inbound_quantity?.toString()}
				endContent={<Link color="warning" href="https://www.libtorrent.org/reference-Settings.html#i2p_inbound_quantity" target="_blank" referrerPolicy="no-referrer"><IconExternalLink /></Link>}
			/>
			<Input
				isDisabled={!i2pEnabledState}
				color="warning"
				name="i2p_outbound_quantity"
				label="I2P outbound quantity"
				type="number"
				defaultValue={i2p_outbound_quantity?.toString()}
				endContent={<Link color="warning" href="https://www.libtorrent.org/reference-Settings.html#i2p_outbound_quantity" target="_blank" referrerPolicy="no-referrer"><IconExternalLink /></Link>}
			/>
			<Input
				isDisabled={!i2pEnabledState}
				color="warning"
				name="i2p_inbound_length"
				label="I2P inbound length"
				type="number"
				defaultValue={i2p_inbound_length?.toString()}
				endContent={<Link color="warning" href="https://www.libtorrent.org/reference-Settings.html#i2p_inbound_length" target="_blank" referrerPolicy="no-referrer"><IconExternalLink /></Link>}
			/>
			<Input
				isDisabled={!i2pEnabledState}
				color="warning"
				name="i2p_outbound_length"
				label="I2P outbound length"
				type="number"
				defaultValue={i2p_outbound_length?.toString()}
				endContent={<Link color="warning" href="https://www.libtorrent.org/reference-Settings.html#i2p_outbound_length" target="_blank" referrerPolicy="no-referrer"><IconExternalLink /></Link>}
			/>
			<Divider className="my-2" />

			<Select
				name="proxy_type"
				label="Proxy type"
				selectedKeys={proxyTypeState ? new Set([proxyTypeState]) : new Set()}
				onSelectionChange={selection => setProxyTypeState(selection.currentKey as typeof proxy_type)}
			>
				<SelectItem key="None">Disabled</SelectItem>
				<SelectItem key="SOCKS4">SOCKS4</SelectItem>
				<SelectItem key="SOCKS5">SOCKS5</SelectItem>
				<SelectItem key="HTTP">HTTP</SelectItem>
			</Select>
			<Input name="proxy_ip" label="Proxy hostname" isDisabled={proxyTypeState === 'None'} defaultValue={proxy_ip} />
			<Input name="proxy_port" label="Proxy Port" isDisabled={proxyTypeState === 'None'} defaultValue={proxy_port?.toString()} type="number" />
			<Checkbox name="proxy_auth_enabled" isDisabled={proxyTypeState === 'None'} isSelected={proxyAuthEnabledState} onValueChange={setProxyAuthEnabledState}>Proxy requires authentication</Checkbox>
			<Input name="proxy_username" isDisabled={proxyTypeState === 'None'} defaultValue={proxy_username} label="Proxy username" />
			<Input name="proxy_password" isDisabled={proxyTypeState === 'None'} defaultValue={proxy_password} type="password" label="Proxy password (saved unencrypted)" />
			<Checkbox name="proxy_hostname_lookup" isDisabled={proxyTypeState === 'None'} defaultSelected={proxy_hostname_lookup}>Use proxy for hostname lookups</Checkbox>
			<Checkbox name="proxy_bittorrent" isDisabled={proxyTypeState === 'None'} defaultSelected={proxy_bittorrent}>Use proxy for bittorrent</Checkbox>
			<Checkbox name="proxy_peer_connections" isDisabled={proxyTypeState === 'None'} defaultSelected={proxy_peer_connections}>Use proxy for peer and web seed connection</Checkbox>
			<Checkbox name="proxy_rss" isDisabled={proxyTypeState === 'None'} defaultSelected={proxy_rss}>Use proxy for RSS</Checkbox>
			<Checkbox name="proxy_misc" isDisabled={proxyTypeState === 'None'} defaultSelected={proxy_misc}>Use proxy for general purposes</Checkbox>
			<Divider className="my-2" />

			<Checkbox name="ip_filter_enabled" isSelected={ipFilterEnabledState} onValueChange={setIpFilterEnabledState}>Enable IP filtering</Checkbox>
			<Input name="ip_filter_path" isDisabled={!ipFilterEnabledState} defaultValue={ip_filter_path} label="Path to IP filter file (.dat, .p2p, .p2b files only)" />
			<Checkbox name="ip_filter_trackers" isDisabled={!ipFilterEnabledState} defaultSelected={ip_filter_trackers}>Apply IP filtering to trackers</Checkbox>
			<Textarea name="banned_IPs" label="Manually banned IP addresses" isDisabled={!ipFilterEnabledState} defaultValue={banned_IPs} />
		</>
	)
})
