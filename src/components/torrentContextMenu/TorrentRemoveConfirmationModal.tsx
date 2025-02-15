import { useDeleteTorrents } from '@/api/useDeleteTorrent'

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import { memo } from 'react'

export const TorrentRemoveConfirmationModal = memo(({
	torrentHashes,
	isOpen,
	onClose,
	withFiles = false,
}: {
	torrentHashes: string[]
	isOpen: boolean
	withFiles?: boolean
	onClose: () => void
}) => {
	const [deleteTorrent, isDeleteTorrentLoading] = useDeleteTorrents()

	return (
		<Modal isOpen={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{withFiles ? 'Remove torrent and files' : 'Remove torrent'}
						</ModalHeader>
						<ModalBody>
							{withFiles
								? (
										<p>
											Are you sure you want to remove this torrent and all its
											associated files? This action is not reversible.
										</p>
									)
								: (
										<p>
											Are you sure you want to remove this torrent? This action is
											not reversible.
										</p>
									)}
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								Close
							</Button>
							<Button
								color="primary"
								isLoading={isDeleteTorrentLoading}
								onPress={async () => {
									await deleteTorrent(torrentHashes, withFiles)
									onClose()
								}}
							>
								{withFiles ? 'Remove torrent & files' : 'Remove torrent'}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
})
