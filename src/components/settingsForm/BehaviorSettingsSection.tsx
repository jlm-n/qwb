import { type QBittorrentPreferences, QBittorrentPreferencesFileLogAgeType } from '@/types/QBittorrentPreferences'
import { Input } from '@heroui/input'
import { Checkbox, Divider, Select, SelectItem } from '@heroui/react'
import { memo, useState } from 'react'

export const BehaviorSettingsSection = memo(
	({
		locale,
		file_log_enabled,
		file_log_path,
		file_log_backup_enabled,
		file_log_max_size,
		file_log_delete_old,
		file_log_age,
		file_log_age_type,
		performance_warning,
	}: Pick<
		QBittorrentPreferences,
		| 'locale'
		| 'file_log_enabled'
		| 'file_log_path'
		| 'file_log_backup_enabled'
		| 'file_log_max_size'
		| 'file_log_delete_old'
		| 'file_log_age'
		| 'file_log_age_type'
		| 'performance_warning'
	>) => {
		const [logEnabledState, setLogEnabledState] = useState(file_log_enabled)
		const [logBackupEnabledState, setLogBackupEnabledState] = useState(file_log_backup_enabled)
		const [logDeleteOldEnabledState, setLogDeleteOldEnabledState] = useState(file_log_delete_old)

		return (
			<>
				<Select name="locale" label="Language" defaultSelectedKeys={locale ? new Set([locale]) : new Set()}>
					<SelectItem key="en">English</SelectItem>
				</Select>
				<Divider className="my-2" />

				<Checkbox name="file_log_enabled" isSelected={logEnabledState} onValueChange={setLogEnabledState}>
					Enable log file
				</Checkbox>
				<Input isDisabled={!logEnabledState} name="file_log_path" label="Log file location" defaultValue={file_log_path} />
				<Checkbox
					isDisabled={!logEnabledState}
					name="file_log_backup_enabled"
					isSelected={logBackupEnabledState}
					onValueChange={setLogBackupEnabledState}
				>
					Backup log file after
				</Checkbox>
				<Input
					isDisabled={!logEnabledState || !logBackupEnabledState}
					name="file_log_max_size"
					label="Backup log file after"
					type="number"
					defaultValue={file_log_max_size?.toString()}
					endContent="KiB"
				/>
				<Checkbox
					isDisabled={!logEnabledState}
					name="file_log_delete_old"
					isSelected={logDeleteOldEnabledState}
					onValueChange={setLogDeleteOldEnabledState}
				>
					Delete old backup files
				</Checkbox>
				<div className="flex gap-3">
					<Input
						isDisabled={!logEnabledState || !logDeleteOldEnabledState}
						name="file_log_age"
						label="Delete after"
						type="number"
						defaultValue={file_log_age?.toString()}
					/>
					<Select
						name="file_log_age_type"
						label="File log age type"
						disallowEmptySelection
						defaultSelectedKeys={file_log_age_type !== undefined ? new Set([file_log_age_type.toString()]) : new Set()}
					>
						<SelectItem key={QBittorrentPreferencesFileLogAgeType.DAYS.toString()}>days</SelectItem>
						<SelectItem key={QBittorrentPreferencesFileLogAgeType.MONTHS.toString()}>months</SelectItem>
						<SelectItem key={QBittorrentPreferencesFileLogAgeType.YEARS.toString()}>years</SelectItem>
					</Select>
				</div>
				<Divider className="my-2" />
				<Checkbox name="performance_warning" defaultSelected={performance_warning}>
					Log performance warnings
				</Checkbox>
			</>
		)
	}
)
