import type { QBittorrentTorrentPieceState, QBittorrentTorrentPieceStates } from '@/types/QBittorrentTorrentPieceState'
import {
	useGetTorrentPieceStates,
} from '@/api/useGetTorrentPieceStates'
import { useInterval } from '@/hooks/useInterval'
import { useTorrentPiecesRefreshRate } from '@/hooks/useTorrentPiecesRefreshRate'
import { useCallback, useMemo, useRef, useState } from 'react'

export function TorrentPiecesProgressBar({ torrentHash }: { torrentHash?: string }) {
	const [pieceStates, setPieceStates] = useState<QBittorrentTorrentPieceStates | undefined>()
	const [getTorrentPieceStates] = useGetTorrentPieceStates()
	const [refreshRate] = useTorrentPiecesRefreshRate()

	const refreshPieceStates = useCallback(async () => {
		if (!torrentHash) {
			return
		}
		const pieceStates = await getTorrentPieceStates(torrentHash)
		setPieceStates(pieceStates)
	}, [torrentHash, getTorrentPieceStates])

	useMemo(() => {
		if (torrentHash) {
			refreshPieceStates()
		}
	}, [torrentHash, refreshPieceStates])
	useInterval(refreshPieceStates, refreshRate)

	const canvasRef = useRef<HTMLCanvasElement>(null)

	useMemo(() => {
		const canvas = canvasRef.current
		const context = canvas?.getContext('2d')
		if (!canvas || !context || !pieceStates || pieceStates.length === 0) {
			return
		}

		const width = canvas.width
		const height = canvas.height
		const pieceWidth = width / pieceStates.length

		context.clearRect(0, 0, width, height)
		context.beginPath()
		context.lineWidth = 0

		const pieceStateColor: Record<QBittorrentTorrentPieceState, string> = {
			0: '#ffffff',
			1: '#ff0000',
			2: '#006fee',
		}

		for (let i = 0; i < pieceStates.length;) {
			const pieceState = pieceStates[i]
			let j = i

			for (; j < pieceStates.length && pieceStates[j] === pieceState; j++) {
				// we just iterate over the identical pieces states
			}

			const x = i * pieceWidth
			context.fillStyle = pieceStateColor[pieceState]
			context.fillRect(x, 0, pieceWidth * (j - i), height)
			i = j
		}

		context.stroke()
	}, [pieceStates])

	return (
		<canvas
			ref={canvasRef}
			className="w-full rounded border h-4"
			height={canvasRef.current?.getBoundingClientRect()?.height}
			width={canvasRef.current?.getBoundingClientRect()?.width}
			style={{ width: '100%', imageRendering: 'pixelated' }}
		/>
	)
}
