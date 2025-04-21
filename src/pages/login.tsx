import type { ChangeEvent } from 'react'
import { AppAndServerSettingsButton } from '@/components/torrentTable/top/AppAndServerSettingsButton'
import { useServerBaseUrl } from '@/hooks/useServerBaseUrl'
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Input } from '@heroui/react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [serverBaseUrl] = useServerBaseUrl()
	const naviate = useNavigate()

	const signIn = useCallback(async () => {
		setIsLoading(true)
		const response = await fetch(`${serverBaseUrl}/api/v2/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				username,
				password,
			}),
			credentials: 'include',
		})

		if (response.status === 200) {
			naviate('/')
		}

		setIsLoading(false)
	}, [username, password, serverBaseUrl, naviate])

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<Card className=" h-full w-full md:w-80 md:h-fit px-4">
				<CardHeader className="flex-col items-center justify-center gap-y-6 mt-6">
					<Image
						alt="nextui logo"
						height={60}
						radius="sm"
						src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPgogIDx0aXRsZT4KICAgIHFiaXR0b3JyZW50LW5ldy1saWdodAogIDwvdGl0bGU+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgeDE9IjM0LjAxMiUiIHkxPSIwJSIgeDI9Ijc2LjM3MyUiIHkyPSI3Ni44MDUlIiBpZD0iYSI+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiM3MkI0RjUiIG9mZnNldD0iMCUiLz4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzM1NkVCRiIgb2Zmc2V0PSIxMDAlIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGNpcmNsZSBzdHJva2U9IiNEQUVGRkYiIHN0cm9rZS13aWR0aD0iMzIiIGZpbGw9InVybCgjYSkiIGN4PSI1MTIiIGN5PSI1MTIiIHI9IjQ5NiIvPgogICAgPHBhdGggZD0iTTcxMi44OTggMzMyLjM5OXE2Ni42NTcgMCAxMDMuMzggNDUuNjcxIDM3LjAzIDQ1LjM2NCAzNy4wMyAxMjguNjg0dC0zNy4zNCAxMjkuNjFxLTM3LjAzIDQ1Ljk4LTEwMy4wNyA0NS45OC0zMy4wMiAwLTYwLjQ4NC0xMi4wMzUtMjcuMTU2LTEyLjM0NC00NS42NzItMzcuNjQ5aC0zLjcwM2wtMTAuOCA0My41MTJoLTM2LjcyNFYxOTZoNTEuMjI3djExNi42NXEwIDM5LjE5MS0yLjQ2OSA3MC4zNTloMi40N3EzNS43OTYtNTAuNjEgMTA2LjE1NS01MC42MXptLTcuNDA2IDQyLjg5NHEtNTIuNDYgMC03NS42MDUgMzAuMjQyLTIzLjE0NSAyOS45MzQtMjMuMTQ1IDEwMS4yMTl0MjMuNzYyIDEwMi4xNDVxMjMuNzYxIDMwLjU1IDc2LjIyMiAzMC41NSA0Ny4yMTUgMCA3MC4zNi0zNC4yNTQgMjMuMTQ0LTM0LjU2MiAyMy4xNDQtOTkuMDU4IDAtNjYuMDQtMjMuMTQ0LTk4LjQ0Mi0yMy4xNDUtMzIuNDAyLTcxLjU5NC0zMi40MDJ6IiBmaWxsPSIjZmZmIi8+CiAgICA8cGF0aCBkPSJNMzE3LjI3MyA2MzkuNDVxNTEuMjI3IDAgNzQuNjgtMjcuNDY2IDIzLjQ1My0yNy40NjQgMjQuOTk2LTkyLjU3OHYtMTEuNDE4cTAtNzAuOTc2LTI0LjA3LTEwMi4xNDQtMjQuMDctMzEuMTY4LTc2LjIyMy0zMS4xNjgtNDUuMDU1IDAtNjkuMTI1IDM1LjE4LTIzLjc2MiAzNC44Ny0yMy43NjIgOTguNzUgMCA2My44NzkgMjMuNDU0IDk3LjUxNSAyMy43NjEgMzMuMzI4IDcwLjA1IDMzLjMyOHptLTcuNzE1IDQyLjg5NHEtNjUuNDIxIDAtMTAyLjE0NC00NS45OC0zNi43MjMtNDUuOTgxLTM2LjcyMy0xMjguMzc2IDAtODMuMDExIDM3LjAzMi0xMjkuNjA5IDM3LjAzLTQ2LjU5OCAxMDMuMDctNDYuNTk4IDY5LjQzMyAwIDEwNi43NzMgNTIuNDYxaDIuNzc4bDcuNDA2LTQ2LjI4OWg0MC40MjZWODI4aC01MS4yMjdWNjgzLjI3cTAtMzAuODYgMy4zOTUtNTIuNDYxaC00LjAxMnEtMzUuNDg4IDUxLjUzNS0xMDYuNzc0IDUxLjUzNXoiIGZpbGw9IiNjOGU4ZmYiLz4KICA8L2c+Cjwvc3ZnPg=="
						width={60}
					/>
					<div className="flex flex-col items-center justify-center">
						<p className="text-md">Login Required</p>
						<p className="text-small text-default-500">You must sign it to continue.</p>
					</div>
				</CardHeader>
				<CardBody className="gap-5">
					<Input
						label="Username"
						type="username"
						value={username}
						labelPlacement="outside"
						onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
					/>
					<Input
						label="Password"
						type="password"
						labelPlacement="outside"
						value={password}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
					/>
				</CardBody>
				<CardFooter className="gap-3">
					<AppAndServerSettingsButton appSettingsOnly={true} className="self-start" />
					<Button fullWidth={true} className="mb-6" color="primary" isLoading={isLoading} variant="shadow" onPress={signIn}>
						Sign In
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
