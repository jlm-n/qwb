import { useSetPreferences } from '@/api/useSetPreferences'
import { ApplicationSettingsForm } from '@/components/settingsForm/ApplicationSettingsForm'
import { QBittorrentPreferencesAssembler } from '@/components/settingsForm/QBittorrentPreferencesAssembler'
import { ServerSettingsForm } from '@/components/settingsForm/ServerPreferencesForm'
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Tab, Tabs, useDisclosure } from '@nextui-org/react'
import { IconSettings } from '@tabler/icons-react'
import { memo, useCallback, useRef, useState } from 'react'

export const AppAndServerSettingsButton = memo(({ className, appSettingsOnly = false }: { className?: string, appSettingsOnly?: boolean }) => {
	const { isOpen, onOpen: open, onClose: close } = useDisclosure()
	const [currentTab, setCurrentTab] = useState<string | number>('appSettings')
	const serverSettingsFormRef = useRef<HTMLFormElement>(null)

	const [setServerPreferences, isSetPreferencesLoading] = useSetPreferences()
	const handleSubmit = useCallback(async () => {
		if (serverSettingsFormRef.current) {
			const payload = QBittorrentPreferencesAssembler.fromFormElement(serverSettingsFormRef.current)
			await setServerPreferences(payload)
		}
	}, [setServerPreferences, serverSettingsFormRef])

	return (
		<>
			<Button isIconOnly className={className} onPress={open}><IconSettings /></Button>
			<Drawer
				isOpen={isOpen}
				onClose={close}
				size="2xl"
				radius="lg"
				classNames={{ base: 'md:m-3 sm:rounded-none md:rounded-lg' }}
			>
				<DrawerContent>
					<DrawerHeader>
						<Tabs size="lg" selectedKey={currentTab} onSelectionChange={setCurrentTab}>
							<Tab title="App Settings" key="appSettings" />
							{!appSettingsOnly && <Tab title="QBittorrent Settings" key="qbittorrentSettings" />}
						</Tabs>
					</DrawerHeader>
					<DrawerBody className="w-full">
						{currentTab === 'appSettings' && <ApplicationSettingsForm />}
						{currentTab === 'qbittorrentSettings' && <ServerSettingsForm formRef={serverSettingsFormRef} />}
					</DrawerBody>
					{currentTab === 'qbittorrentSettings' && (
						<DrawerFooter>
							<Button color="danger" variant="light" onPress={close}>Cancel</Button>
							<Button color="primary" onPress={handleSubmit} isLoading={isSetPreferencesLoading}>Save preferences</Button>
						</DrawerFooter>
					)}
				</DrawerContent>
			</Drawer>
		</>
	)
})
