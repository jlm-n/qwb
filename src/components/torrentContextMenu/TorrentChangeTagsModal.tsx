import type { Selection } from '@heroui/react'
import { useAddTorrentTags } from '@/api/useAddTorrentTags'
import { useRemoveTorrentTags } from '@/api/useRemoveTorrentTags'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@heroui/react'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'

export const TorrentChangeTagsModal = memo(
	({
		torrentHashes,
		isOpen,
		onClose,
		currentTags,
		tags,
	}: {
		torrentHashes: string[]
		isOpen: boolean
		onClose: () => void
		currentTags: string | undefined
		tags: string[]
	}) => {
		const [addTorrentTags, isAddTorrenTagsLoading] = useAddTorrentTags()
		const [removeTorrentTags, isRemoveTorrentTagsLoading] = useRemoveTorrentTags()

		const currentTagsArray = useMemo(() => (currentTags || '').split(',').filter(Boolean), [currentTags])
		const [selectedTags, setSelectedTags] = useState<Selection>(new Set(currentTags))
		useEffect(() => {
			setSelectedTags(new Set(currentTags))
		}, [currentTags])

		const saveSelectedTags = useCallback(async () => {
			if (selectedTags !== 'all' && JSON.stringify(currentTagsArray) !== JSON.stringify(selectedTags)) {
				const s = Array.from(selectedTags)
				const toAdd = s.filter((t) => !currentTagsArray.includes(t as string)) as string[]
				if (toAdd.length > 0) {
					await addTorrentTags(torrentHashes, toAdd)
				}

				const toRemove = currentTagsArray.filter((t) => !s.includes(t)) as string[]
				if (toRemove.length > 0) {
					await removeTorrentTags(torrentHashes, toRemove)
				}
			}
		}, [selectedTags, currentTagsArray, addTorrentTags, torrentHashes, removeTorrentTags])

		return (
			<Modal isOpen={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Set Torrent tags</ModalHeader>
							<ModalBody>
								<Select
									label="Tags"
									placeholder="Select an animal"
									selectionMode="multiple"
									selectedKeys={selectedTags}
									onSelectionChange={setSelectedTags}
								>
									{tags.sort().map((tag) => (
										<SelectItem key={tag}>{tag}</SelectItem>
									))}
								</Select>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									color="primary"
									isDisabled={JSON.stringify(currentTags) === JSON.stringify(selectedTags)}
									isLoading={isAddTorrenTagsLoading || isRemoveTorrentTagsLoading}
									onPress={async () => {
										await saveSelectedTags()
										onClose()
									}}
								>
									Update tags
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		)
	}
)
