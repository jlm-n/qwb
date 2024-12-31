import { useChangeTorrentLocation } from '@/api/useChangeTorrentLocation'
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@nextui-org/react'

import { useState } from 'react'

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
								defaultValue={currentLocation}
								label="New location"
								onChange={e => setLocation(e.target.value)}
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
