import { HeroUIProvider } from '@heroui/system'
import { useTheme } from '@heroui/use-theme'
import { useNavigate } from 'react-router-dom'

export function Provider({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate()
	const { theme } = useTheme()

	return (
		<HeroUIProvider navigate={navigate}>
			<main className={`${theme} text-foreground bg-background relative flex flex-col h-screen`}>
				{children}
			</main>
		</HeroUIProvider>
	)
}
