import { type QBittorrentPreferences, QBittorrentPreferencesDYNDNSService } from '@/types/QBittorrentPreferences'
import { Checkbox, Divider, Input, Link, Select, SelectItem, Textarea } from '@nextui-org/react'
import { memo, useState } from 'react'

export const WebUISettingsSection = memo(({
	web_ui_address,
	web_ui_port,
	web_ui_upnp,
	use_https,
	web_ui_https_cert_path,
	web_ui_https_key_path,
	web_ui_username,
	bypass_local_auth,
	bypass_auth_subnet_whitelist_enabled,
	bypass_auth_subnet_whitelist,
	web_ui_max_auth_fail_count,
	web_ui_ban_duration,
	web_ui_session_timeout,
	alternative_webui_enabled,
	alternative_webui_path,
	web_ui_clickjacking_protection_enabled,
	web_ui_csrf_protection_enabled,
	web_ui_secure_cookie_enabled,
	web_ui_host_header_validation_enabled,
	web_ui_domain_list,
	web_ui_use_custom_http_headers_enabled,
	web_ui_custom_http_headers,
	web_ui_reverse_proxy_enabled,
	web_ui_reverse_proxies_list,
	dyndns_enabled,
	dyndns_service,
	dyndns_domain,
	dyndns_username,
	dyndns_password,
}: Pick<
	QBittorrentPreferences,
	'web_ui_address'
	| 'web_ui_port'
	| 'web_ui_upnp'
	| 'use_https'
	| 'web_ui_https_cert_path'
	| 'web_ui_https_key_path'
	| 'web_ui_username'
	| 'bypass_local_auth'
	| 'bypass_auth_subnet_whitelist_enabled'
	| 'bypass_auth_subnet_whitelist'
	| 'web_ui_max_auth_fail_count'
	| 'web_ui_ban_duration'
	| 'web_ui_session_timeout'
	| 'alternative_webui_enabled'
	| 'alternative_webui_path'
	| 'web_ui_clickjacking_protection_enabled'
	| 'web_ui_csrf_protection_enabled'
	| 'web_ui_secure_cookie_enabled'
	| 'web_ui_host_header_validation_enabled'
	| 'web_ui_domain_list'
	| 'web_ui_use_custom_http_headers_enabled'
	| 'web_ui_custom_http_headers'
	| 'web_ui_reverse_proxy_enabled'
	| 'web_ui_reverse_proxies_list'
	| 'dyndns_enabled'
	| 'dyndns_service'
	| 'dyndns_domain'
	| 'dyndns_username'
	| 'dyndns_password'
>) => {
	const [useHTTPSEnabledState, setUseHTTPSEnabledState] = useState(use_https)
	const [bypassAuthSubnetWhitelistEnabledState, setBypassAuthSubnetWhitelistEnabledState] = useState(bypass_auth_subnet_whitelist_enabled)
	const [alternativeWebUIEnabledState, setAlternativeWebUIEnabledState] = useState(alternative_webui_enabled)
	const [hostHeaderValidationEnabledState, setHostHeaderValidationEnabledState] = useState(web_ui_host_header_validation_enabled)
	const [useCustomHTTPHeadersEnabledState, setUseCustomHTTPHeadersEnabledState] = useState(web_ui_use_custom_http_headers_enabled)
	const [useReverseProxyEnabledState, setUseReverseProxyEnabledState] = useState(web_ui_reverse_proxy_enabled)
	const [dyndnsEnabledState, setDyndnsEnabledState] = useState(dyndns_enabled)

	return (
		<>
			<Input name="web_ui_address" label="WebUI listen IP address" defaultValue={web_ui_address} />
			<Input
				name="web_ui_port"
				label="WebUI listen port"
				defaultValue={web_ui_port?.toString()}
				type="number"
			/>
			<Divider className="my-2" />

			<Checkbox name="web_ui_upnp" defaultSelected={web_ui_upnp}>Use UPnP / NAT-PMP to forward the WebUI port from my router</Checkbox>
			<Divider className="my-2" />

			<div className="flex gap-1">
				<Checkbox name="use_https" isSelected={useHTTPSEnabledState} onValueChange={setUseHTTPSEnabledState}>Use HTTPS instead of HTTP</Checkbox>
				<Link href="https://httpd.apache.org/docs/current/ssl/ssl_faq.html#aboutcerts" target="blank" referrerPolicy="no-referrer">More information</Link>
			</div>
			<Input
				name="web_ui_https_cert_path"
				label="Path to SSL certificate"
				isDisabled={!useHTTPSEnabledState}
				defaultValue={web_ui_https_cert_path}
			/>
			<Input
				name="web_ui_https_key_path"
				label="Path to SSL keyfile"
				isDisabled={!useHTTPSEnabledState}
				defaultValue={web_ui_https_key_path}
			/>
			<Divider className="my-2" />

			<Input name="web_ui_username" label="WebUI username" type="username" defaultValue={web_ui_username} />
			<Input name="web_ui_password" label="WebUI password" type="password" placeholder="Change current password" />
			<Checkbox name="bypass_local_auth" defaultSelected={bypass_local_auth}>Bypass authentication for clients on localhost</Checkbox>
			<Checkbox name="bypass_auth_subnet_whitelist_enabled" isSelected={bypassAuthSubnetWhitelistEnabledState} onValueChange={setBypassAuthSubnetWhitelistEnabledState}>Bypass authentication for clients in whitelisted IP subnets</Checkbox>
			<Textarea name="bypass_auth_subnet_whitelist" label="Authentication bypass subnet whitelist (comma separated liste)" isDisabled={!bypassAuthSubnetWhitelistEnabledState} defaultValue={bypass_auth_subnet_whitelist} />
			<Input
				name="web_ui_max_auth_fail_count"
				label="Ban clients after consecutive failures"
				defaultValue={web_ui_max_auth_fail_count?.toString()}
				type="number"
			/>
			<Input
				name="web_ui_ban_duration"
				label="Ban clients for"
				defaultValue={web_ui_ban_duration?.toString()}
				type="number"
				endContent={<p className="text-nowrap">seconds</p>}
			/>
			<Input
				name="web_ui_session_timeout"
				label="Session timeout"
				defaultValue={web_ui_session_timeout?.toString()}
				type="number"
				endContent={<p className="text-nowrap">seconds</p>}
			/>
			<Divider className="my-2" />

			<Checkbox name="alternative_webui_enabled" isSelected={alternativeWebUIEnabledState} onValueChange={setAlternativeWebUIEnabledState}>Use alternative WebUI</Checkbox>
			<Input name="alternative_webui_path" label="Alternative WebUI path" isDisabled={!alternativeWebUIEnabledState} defaultValue={alternative_webui_path} />
			<Divider className="my-2" />

			<Checkbox name="web_ui_clickjacking_protection_enabled" defaultSelected={web_ui_clickjacking_protection_enabled}>Enable clickjacking protection</Checkbox>
			<Checkbox name="web_ui_csrf_protection_enabled" defaultSelected={web_ui_csrf_protection_enabled}>Enable Cross-Site Request Forgery (CSRF) protection</Checkbox>
			<Checkbox name="web_ui_secure_cookie_enabled" defaultSelected={web_ui_secure_cookie_enabled}>Enable cookie Secure flag (requires HTTPS)</Checkbox>
			<Divider className="my-2" />

			<Checkbox name="web_ui_host_header_validation_enabled" isSelected={hostHeaderValidationEnabledState} onValueChange={setHostHeaderValidationEnabledState}>Enable Host header validation</Checkbox>
			<Input name="web_ui_domain_list" label="Authorized Host domains (semicolon separated values)" isDisabled={!hostHeaderValidationEnabledState} defaultValue={web_ui_domain_list} />
			<Divider className="my-2" />

			<Checkbox name="web_ui_use_custom_http_headers_enabled" isSelected={useCustomHTTPHeadersEnabledState} onValueChange={setUseCustomHTTPHeadersEnabledState}>Add custom HTTP headers</Checkbox>
			<Textarea name="web_ui_custom_http_headers" label="Custom HTTP headers (1 per line)" isDisabled={!useCustomHTTPHeadersEnabledState} defaultValue={web_ui_custom_http_headers} />
			<Divider className="my-2" />

			<Checkbox name="web_ui_reverse_proxy_enabled" isSelected={useReverseProxyEnabledState} onValueChange={setUseReverseProxyEnabledState}>Enable reverse proxy support</Checkbox>
			<Input name="web_ui_reverse_proxies_list" label="Trusted proxies list" isDisabled={!useReverseProxyEnabledState} defaultValue={web_ui_reverse_proxies_list} />
			<Divider className="my-2" />

			<Checkbox name="dyndns_enabled" isSelected={dyndnsEnabledState} onValueChange={setDyndnsEnabledState}>Update my dynamic domain nam</Checkbox>
			<Select name="dyndns_service" label="Dynamic DNS service" isDisabled={!dyndnsEnabledState} defaultSelectedKeys={dyndns_service !== undefined ? new Set([dyndns_service.toString()]) : new Set()}>
				<SelectItem key={QBittorrentPreferencesDYNDNSService.USE_DYDNS.toString()}>DynDNS</SelectItem>
				<SelectItem key={QBittorrentPreferencesDYNDNSService.USE_NOIP.toString()}>No-IP</SelectItem>
			</Select>
			<Input name="dyndns_domain" label="Domain name" isDisabled={!dyndnsEnabledState} defaultValue={dyndns_domain} />
			<Input name="dyndns_username" label="Username" type="username" isDisabled={!dyndnsEnabledState} defaultValue={dyndns_username} />
			<Input name="dyndns_password" label="Password" type="password" isDisabled={!dyndnsEnabledState} defaultValue={dyndns_password} />

		</>
	)
})
