import { NextUIProvider } from '@nextui-org/system'
import { useTheme } from '@nextui-org/use-theme'
import { useNavigate } from 'react-router-dom'

export function Provider({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate()
	const { theme } = useTheme()

	return (
		<NextUIProvider navigate={navigate}>
			<main className={`${theme} text-foreground bg-background relative flex flex-col h-screen`}>
				{children}
			</main>
		</NextUIProvider>
	)
}
