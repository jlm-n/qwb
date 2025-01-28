import { useChangeTorrentLocation } from '@/api/useChangeTorrentLocation'
import { useGetTorrentFiles } from '@/api/useGetTorrentFiles'
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'

import { IconWand } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { normalizeTorrentPath } from '../torrentTable/normalizeTorrentPath'

export function TorrentChangeLocationModal({
	torrentHashes,
	isOpen,
	onClose,
	currentLocation,
	currentName,
}: {
	torrentHashes: string[]
	isOpen: boolean
	onClose: () => void
	currentLocation: string
	currentName: string
}) {
	const [changeLocation, isChangeLocationLoading] = useChangeTorrentLocation()
	const [location, setLocation] = useState<string>(currentLocation)

	useEffect(() => {
		setLocation(currentLocation)
	}, [currentLocation, setLocation])

	const [getTorrentFiles, getTorrentFilesLoading] = useGetTorrentFiles()
	const onNormalizeTorrentPathPressed = useCallback(async () => {
		if (torrentHashes[0]) {
			const files = await getTorrentFiles(torrentHashes[0])
			const path = normalizeTorrentPath(currentName, files)

			setLocation(path)
		}
	}, [currentName, torrentHashes, getTorrentFiles])

	return (
		<Modal isOpen={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Move torrent and files
						</ModalHeader>
						<ModalBody>
							<Input
								isReadOnly
								className="opacity-50"
								label="Current name"
								value={currentName}
							/>
							<Input
								isReadOnly
								className="opacity-50"
								label="Current location"
								value={currentLocation}
							/>
							<Input
								isRequired
								label="New location"
								value={location}
								endContent={(
									<Button isLoading={getTorrentFilesLoading} variant="light" isIconOnly size="sm" title="Normalize location" radius="sm" className="m-auto -mr-1" onPress={onNormalizeTorrentPathPressed}>
										<IconWand width={16} />
									</Button>
								)}
								onValueChange={setLocation}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							<Button
								color="primary"
								isDisabled={!location || location === currentLocation}
								isLoading={isChangeLocationLoading}
								onPress={async () => {
									await changeLocation(torrentHashes, location)
									onClose()
								}}
							>
								Move torrent
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
