import { useRenameTorrent } from '@/api/useRenameTorrent'
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'

import { memo, useState } from 'react'

export const TorrentRenameModal = memo(({
	torrentHash,
	isOpen,
	onClose,
	currentName,
}: {
	torrentHash: string
	isOpen: boolean
	onClose: () => void
	currentName: string
}) => {
	const [rename, isLoading] = useRenameTorrent()
	const [name, setName] = useState<string>(currentName)

	return (
		<Modal isOpen={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Rename torrent
						</ModalHeader>
						<ModalBody>
							<Input
								isReadOnly
								className="opacity-50"
								label="Current name"
								value={currentName}
							/>
							<Input
								isRequired
								defaultValue={currentName}
								label="New name"
								onChange={e => setName(e.target.value)}
							/>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							<Button
								color="primary"
								isDisabled={!name || name === currentName}
								isLoading={isLoading}
								onPress={async () => {
									await rename(torrentHash, name)
									onClose()
								}}
							>
								Rename
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
})
