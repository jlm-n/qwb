import { type QBittorrentPreferences, QBittorrentPreferencesSchedulerDays } from '@/types/QBittorrentPreferences'
import { Checkbox, Divider, Input, Select, SelectItem, TimeInput } from '@heroui/react'
import { Time } from '@internationalized/date'
import { memo, useCallback, useState } from 'react'

export const SpeedSettingsSection = memo(({
	up_limit,
	dl_limit,
	alt_up_limit,
	alt_dl_limit,
	scheduler_enabled,
	schedule_from_hour,
	schedule_from_min,
	schedule_to_hour,
	schedule_to_min,
	scheduler_days,
	limit_utp_rate,
	limit_tcp_overhead,
	limit_lan_peers,
}: Pick<
	QBittorrentPreferences,
	'up_limit'
	| 'dl_limit'
	| 'alt_up_limit'
	| 'alt_dl_limit'
	| 'scheduler_enabled'
	| 'schedule_from_hour'
	| 'schedule_from_min'
	| 'schedule_to_hour'
	| 'schedule_to_min'
	| 'scheduler_days'
	| 'limit_utp_rate'
	| 'limit_tcp_overhead'
	| 'limit_lan_peers'
>) => {
	const [schedulerEnabledState, setSchedulerEnabledState] = useState(scheduler_enabled)
	const [scheduleFromHourState, setScheduleFromHourState] = useState(schedule_from_hour)
	const [scheduleFromMinState, setScheduleFromMinState] = useState(schedule_from_min)
	const [scheduleToHourState, setScheduleToHourState] = useState(schedule_to_hour)
	const [scheduleToMinState, setScheduleToMinState] = useState(schedule_to_min)

	const onScheduleFromChangedCallback = useCallback((value: Time | null) => {
		setScheduleFromHourState(value?.hour)
		setScheduleFromMinState(value?.minute)
	}, [])
	const onScheduleToChangedCallback = useCallback((value: Time | null) => {
		setScheduleToHourState(value?.hour)
		setScheduleToMinState(value?.minute)
	}, [])

	return (
		<>
			<Input name="up_limit" defaultValue={up_limit?.toString()} label="Global upload limit (0 is unlimited)" type="number" endContent={<p className="text-nowrap">Bytes/s</p>} />
			<Input name="dl_limit" defaultValue={dl_limit?.toString()} label="Global download limit (0 is unlimited)" type="number" endContent={<p className="text-nowrap">Bytes/s</p>} />
			<Divider className="my-2" />

			<Input name="alt_up_limit" defaultValue={alt_up_limit?.toString()} label="Alternative upload limit (0 is unlimited)" type="number" endContent={<p className="text-nowrap">Bytes/s</p>} />
			<Input name="alt_dl_limit" defaultValue={alt_dl_limit?.toString()} label="Alternative download limit (0 is unlimited)" type="number" endContent={<p className="text-nowrap">Bytes/s</p>} />
			<Checkbox name="scheduler_enabled" isSelected={schedulerEnabledState} onValueChange={setSchedulerEnabledState}>Schedule the use of alternative rate limits</Checkbox>
			<div className="flex gap-3">
				<input name="schedule_from_hour" hidden readOnly value={scheduleFromHourState} />
				<input name="schedule_from_min" hidden readOnly value={scheduleFromMinState} />
				<TimeInput isDisabled={!schedulerEnabledState} value={new Time(scheduleFromHourState, scheduleFromMinState)} label="From (in the setup timezone)" onChange={onScheduleFromChangedCallback} />
				<input name="schedule_to_hour" hidden readOnly value={scheduleToHourState} />
				<input name="schedule_to_min" hidden readOnly value={scheduleToMinState} />
				<TimeInput isDisabled={!schedulerEnabledState} value={new Time(scheduleToHourState, scheduleToMinState)} label="To (in the setup timezone)" onChange={onScheduleToChangedCallback} />
			</div>
			<Select isDisabled={!schedulerEnabledState} name="scheduler_days" label="Scheduled days" defaultSelectedKeys={scheduler_days !== undefined ? new Set([scheduler_days?.toString()]) : new Set()}>
				<SelectItem key={QBittorrentPreferencesSchedulerDays.EVERY_DAY.toString()}>Every day</SelectItem>
				<SelectItem key={QBittorrentPreferencesSchedulerDays.EVERY_WEEKDAY.toString()}>Every week day</SelectItem>
				<SelectItem key={QBittorrentPreferencesSchedulerDays.EVERY_WEEKEND.toString()}>Every week-end</SelectItem>
				<SelectItem key={QBittorrentPreferencesSchedulerDays.EVERY_MONDAY.toString()}>Every Monday</SelectItem>
				<SelectItem key={QBittorrentPreferencesSchedulerDays.EVERY_TUESDAY.toString()}>Every Tuesday</SelectItem>
				<SelectItem key={QBittorrentPreferencesSchedulerDays.EVERY_WEDNESDAY.toString()}>Every Wednesday</SelectItem>
				<SelectItem key={QBittorrentPreferencesSchedulerDays.EVERY_THURSDAY.toString()}>Every Thursday</SelectItem>
				<SelectItem key={QBittorrentPreferencesSchedulerDays.EVERY_FRIDAY.toString()}>Every Friday</SelectItem>
				<SelectItem key={QBittorrentPreferencesSchedulerDays.EVERY_SATURDAY.toString()}>Every Saturday</SelectItem>
				<SelectItem key={QBittorrentPreferencesSchedulerDays.EVERY_SUNDAY.toString()}>Every Sunday</SelectItem>
			</Select>
			<Divider className="my-2" />

			<Checkbox name="limit_utp_rate" defaultSelected={limit_utp_rate}>Apply rate limit to µTP protocol</Checkbox>
			<Checkbox name="limit_tcp_overhead" defaultSelected={limit_tcp_overhead}>Apply rate limit to TCP overhead</Checkbox>
			<Checkbox name="limit_lan_peers" defaultSelected={limit_lan_peers}>Apply rate limit to peers on LAN</Checkbox>
		</>
	)
})
