import type { QBittorrentPreferences } from '@/types/QBittorrentPreferences'
import type { RefObject } from 'react'
import { useGetPreferences } from '@/api/useGetPreferences'
import { Spinner, Tab, Tabs } from '@nextui-org/react'
import { memo, useCallback, useEffect, useState } from 'react'
import { AdvancedSettingsSection } from './AdvancedSettingsSection'
import { BehaviorSettingsSection } from './BehaviorSettingsSection'
import { BittorrentSettingsSection } from './BittorrentSettingsSection'
import { ConnectionSettingsSection } from './ConnectionSettingsSection'
import { DownloadSettingsSection } from './DowndloadSettingsSection'
import { RSSSettingsSection } from './RSSSettingsSection'
import { SpeedSettingsSection } from './SpeedSettingsSection'
import { WebUISettingsSection } from './WebUISettingsSection'

export const ServerSettingsForm = memo(({ formRef }: { formRef: RefObject<HTMLFormElement> }) => {
	const [serverPreferencesState, setServerPreferencesState] = useState<QBittorrentPreferences>({} satisfies QBittorrentPreferences)
	const [getServerPreferences, isGetPreferencesLoading, getPreferencesError] = useGetPreferences()

	const getServerPreferencesCallback = useCallback(async () => {
		const preferences = await getServerPreferences()
		setServerPreferencesState(preferences)
	}, [getServerPreferences])

	useEffect(() => {
		getServerPreferencesCallback()
	}, [getServerPreferencesCallback])

	if (isGetPreferencesLoading) {
		return <div className="flex flex-col m-auto"><Spinner /></div>
	}

	if (getPreferencesError) {
		return null
	}

	return (
		<form ref={formRef}>
			<Tabs destroyInactiveTabPanel={false} classNames={{ base: 'w-full', panel: 'flex flex-col gap-3' }}>
				<Tab title="Behavior"><BehaviorSettingsSection {...serverPreferencesState} /></Tab>
				<Tab title="Download"><DownloadSettingsSection {...serverPreferencesState} /></Tab>
				<Tab title="Connection"><ConnectionSettingsSection {...serverPreferencesState} /></Tab>
				<Tab title="Speed"><SpeedSettingsSection {...serverPreferencesState} /></Tab>
				<Tab title="Bittorrent"><BittorrentSettingsSection {...serverPreferencesState} /></Tab>
				<Tab title="RSS"><RSSSettingsSection {...serverPreferencesState} /></Tab>
				<Tab title="WebUI"><WebUISettingsSection {...serverPreferencesState} /></Tab>
				<Tab title="Advanced"><AdvancedSettingsSection {...serverPreferencesState} /></Tab>
			</Tabs>
		</form>
	)
})
