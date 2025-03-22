import type { QBittorrentPreferences } from '@/types/QBittorrentPreferences'
import { useSendTestEmail } from '@/api/useSendTestEmail'
import { Input, Textarea } from '@heroui/input'
import { Alert, Button, Checkbox, Divider, Select, SelectItem } from '@heroui/react'
import { memo, useState } from 'react'
import { ScanDirsInput } from './ScanDirsInput'

export const DownloadSettingsSection = memo(({
	torrent_content_layout,
	add_to_top_of_queue,
	add_stopped_enabled,
	torrent_stop_condition,
	merge_trackers,
	auto_delete_mode,
	preallocate_all,
	incomplete_files_ext,
	use_unwanted_folder,
	auto_tmm_enabled,
	torrent_changed_tmm_enabled,
	save_path_changed_tmm_enabled,
	category_changed_tmm_enabled,
	use_subcategories,
	use_category_paths_in_manual_mode,
	save_path,
	temp_path_enabled,
	temp_path,
	export_dir,
	export_dir_fin,
	scan_dirs,
	exclude_file_names_enabled,
	exclude_file_names,
	mail_notification_enabled,
	mail_notification_sender,
	mail_notification_email,
	mail_notification_smtp,
	mail_notification_ssl_enabled,
	mail_notification_auth_enabled,
	mail_notification_username,
	mail_notification_password,
	autorun_enabled,
	autorun_program,
	autorun_on_torrent_added_enabled,
	autorun_on_torrent_added_program,
}: Pick<
	QBittorrentPreferences,
	'torrent_content_layout'
	| 'add_to_top_of_queue'
	| 'add_stopped_enabled'
	| 'torrent_stop_condition'
	| 'merge_trackers'
	| 'auto_delete_mode'
	| 'preallocate_all'
	| 'incomplete_files_ext'
	| 'use_unwanted_folder'
	| 'auto_tmm_enabled'
	| 'torrent_changed_tmm_enabled'
	| 'save_path_changed_tmm_enabled'
	| 'category_changed_tmm_enabled'
	| 'use_subcategories'
	| 'use_category_paths_in_manual_mode'
	| 'save_path'
	| 'temp_path_enabled'
	| 'temp_path'
	| 'export_dir'
	| 'export_dir_fin'
	| 'scan_dirs'
	| 'exclude_file_names_enabled'
	| 'exclude_file_names'
	| 'mail_notification_enabled'
	| 'mail_notification_sender'
	| 'mail_notification_email'
	| 'mail_notification_smtp'
	| 'mail_notification_ssl_enabled'
	| 'mail_notification_auth_enabled'
	| 'mail_notification_username'
	| 'mail_notification_password'
	| 'autorun_enabled'
	| 'autorun_program'
	| 'autorun_on_torrent_added_enabled'
	| 'autorun_on_torrent_added_program'
>) => {
	const [tempPathEnabledState, setTempPathEnabledState] = useState(temp_path_enabled)
	const [excludeFileNameEnabledState, setExcludeFileNameEnabledSate] = useState(exclude_file_names_enabled)
	const [mailNotificationEnabledState, setMailNotificationEnabledState] = useState(mail_notification_enabled)
	const [mailNotificationAuthEnabledState, setMailNotificationAuthEnabledState] = useState(mail_notification_auth_enabled)
	const [sendTestEmail, isSendTestEmailLoading] = useSendTestEmail()
	const [autorunFinishedEnabledState, setAutorunFinishedEnabledState] = useState(autorun_enabled)
	const [autorunAddedEnabledState, setAutorunAddedEnabledState] = useState(autorun_on_torrent_added_enabled)

	return (
		<>
			<Input name="save_path" defaultValue={save_path} label="Default save path" />
			<Select
				name="torrent_content_layout"
				label="Torrent content layout"
				disallowEmptySelection
				defaultSelectedKeys={torrent_content_layout ? new Set([torrent_content_layout]) : new Set()}
			>
				<SelectItem key="Original">Original</SelectItem>
				<SelectItem key="Subfolder">Create subfolder</SelectItem>
				<SelectItem key="NoSubfolder">Don't create subfolder</SelectItem>
			</Select>
			<Checkbox name="add_to_top_of_queue" defaultSelected={add_to_top_of_queue}>Add torrent to top of queue by default</Checkbox>
			<Checkbox name="add_stopped_enabled" defaultSelected={add_stopped_enabled}>Do not start the download automatically</Checkbox>
			<Select
				name="torrent_stop_condition"
				label="Torrent stop condition"
				disallowEmptySelection
				defaultSelectedKeys={torrent_stop_condition ? new Set([torrent_stop_condition]) : new Set()}
			>
				<SelectItem key="None">None</SelectItem>
				<SelectItem key="MetadataReceived">Metadata received</SelectItem>
				<SelectItem key="FilesChecked">Files checked</SelectItem>
			</Select>
			<Checkbox name="merge_trackers" defaultSelected={merge_trackers}>Merge trackers when duplicates are added</Checkbox>
			<Checkbox name="auto_delete_mode" defaultSelected={auto_delete_mode === 1}>Delete .torrent files afterward</Checkbox>
			<Divider className="my-2" />

			<Checkbox name="preallocate_all" defaultSelected={preallocate_all}>Pre-allocate disk space for all files</Checkbox>
			<Checkbox name="incomplete_files_ext" defaultSelected={incomplete_files_ext}>Append .!qB extension to incomplete files</Checkbox>
			<Checkbox name="use_unwanted_folder" defaultSelected={use_unwanted_folder}>Keep unselected files in ".unwanted" folder</Checkbox>
			<Divider className="my-2" />

			<Checkbox name="auto_tmm_enabled" defaultSelected={auto_tmm_enabled}>Manage torrents automatically by default</Checkbox>
			<Checkbox name="torrent_changed_tmm_enabled" defaultSelected={torrent_changed_tmm_enabled}>When torrent category changes, relocate files</Checkbox>
			<Checkbox name="save_path_changed_tmm_enabled" defaultSelected={save_path_changed_tmm_enabled}>When default save path changes, relocate files</Checkbox>
			<Checkbox name="category_changed_tmm_enabled" defaultSelected={category_changed_tmm_enabled}>When category save path changes, relocate files</Checkbox>
			<Checkbox name="use_subcategories" defaultSelected={use_subcategories}>Use subcategories</Checkbox>
			<Checkbox name="use_category_paths_in_manual_mode" defaultSelected={use_category_paths_in_manual_mode}>Use category paths in manual mode</Checkbox>
			<Checkbox name="temp_path_enabled" isSelected={tempPathEnabledState} onValueChange={setTempPathEnabledState}>Keep incomplete files in a different folder</Checkbox>
			<Input name="temp_path" isDisabled={!tempPathEnabledState} defaultValue={temp_path} label="Incomplete files save path" />
			<Input name="export_dir" defaultValue={export_dir} label=".torrent files save path" />
			<Input name="export_dir_fin" defaultValue={export_dir_fin} label=".torrent files for finished downloads save path" />
			<Divider className="my-2" />

			<ScanDirsInput scan_dirs={scan_dirs} />
			<Divider className="my-2" />

			<Checkbox name="exclude_file_names_enabled" isSelected={excludeFileNameEnabledState} onValueChange={setExcludeFileNameEnabledSate}>Exclude file names</Checkbox>
			<Textarea name="exclude_file_names" label="Excluded file names" isDisabled={!excludeFileNameEnabledState} defaultValue={exclude_file_names} />
			<Divider className="my-2" />

			<Checkbox name="mail_notification_enabled" isSelected={mailNotificationEnabledState} onValueChange={setMailNotificationEnabledState}>
				Send an email notification upon download completion
			</Checkbox>
			<Input name="mail_notification_sender" isDisabled={!mailNotificationEnabledState} defaultValue={mail_notification_sender} label="Email sender" />
			<Input name="mail_notification_email" isDisabled={!mailNotificationEnabledState} defaultValue={mail_notification_email} label="Email recipient" />
			<Input name="mail_notification_smtp" isDisabled={!mailNotificationEnabledState} defaultValue={mail_notification_smtp} label="SMTP server address" />
			<Checkbox name="mail_notification_ssl_enabled" isDisabled={!mailNotificationEnabledState} defaultSelected={mail_notification_ssl_enabled}>This server requires a secure connection (SSL)</Checkbox>
			<Checkbox name="mail_notification_auth_enabled" isDisabled={!mailNotificationEnabledState} isSelected={mailNotificationAuthEnabledState} onValueChange={setMailNotificationAuthEnabledState}>
				This server requires authentication
			</Checkbox>
			<Input name="mail_notification_username" isDisabled={!mailNotificationEnabledState || !mailNotificationAuthEnabledState} defaultValue={mail_notification_username} label="Username" />
			<Input name="mail_notification_password" isDisabled={!mailNotificationEnabledState || !mailNotificationAuthEnabledState} defaultValue={mail_notification_password} type="password" label="Password" />
			<Button className="!rounded w-fit" variant="light" onPress={sendTestEmail} isDisabled={!mailNotificationEnabledState} isLoading={isSendTestEmailLoading}>Send test email</Button>
			<Divider className="my-2" />

			<Checkbox name="autorun_on_torrent_added_enabled" isSelected={autorunAddedEnabledState} onValueChange={setAutorunAddedEnabledState}>Run external program on torrent added</Checkbox>
			<Input name="autorun_on_torrent_added_program" isDisabled={!autorunAddedEnabledState} defaultValue={autorun_on_torrent_added_program} label="Command line to run on torrent added" />
			<Checkbox name="autorun_enabled" isSelected={autorunFinishedEnabledState} onValueChange={setAutorunFinishedEnabledState}>Run external program on torrent finished</Checkbox>
			<Input name="autorun_program" isDisabled={!autorunFinishedEnabledState} defaultValue={autorun_program} label="Command line to run on torrent finished" />
			<Alert
				hideIcon
				title="Supported parameters"
				description={`Case sensitive: %N: Torrent name, %L: Category, %G: Tags (separated by comma), %F: Content path (same as root path for multifile torrent), %R: Root path (first torrent subdirectory path), %D: Save path, %C: Number of files, %Z: Torrent size (bytes), %T: Current tracker, %I: Info hash v1, %J: Info hash v2, %K: Torrent ID. Tip: Encapsulate parameter with quotation marks to avoid text being cut off at whitespace (e.g., "%N").`}
				variant="flat"
			/>
		</>
	)
})
