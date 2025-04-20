import { SettingsProvider } from '@/contexts/SettingsProvider'
import { useSettings } from '@/hooks/useSettings'
import { HeroUIProvider } from '@heroui/system'
import { useNavigate } from 'react-router-dom'

function AppContent({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate()
	const { theme } = useSettings()

	return (
		<HeroUIProvider navigate={navigate}>
			<main
				className={`${theme} text-foreground bg-background relative flex flex-col h-screen`}
			>
				{children}
			</main>
		</HeroUIProvider>
	)
}

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<SettingsProvider>
			<AppContent>{children}</AppContent>
		</SettingsProvider>
	)
}
