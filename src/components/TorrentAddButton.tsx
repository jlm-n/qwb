import { Button } from '@heroui/react'
import { IconPlus } from '@tabler/icons-react'
import { memo, useState } from 'react'
import { TorrentAddModal } from './torrentAddModal/TorrentAddModal'

export const TorrentAddButton = memo(() => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<Button
				color="primary"
				variant="shadow"
				isDisabled={isOpen}
				onPress={() => setIsOpen(true)}
				endContent={<IconPlus width={16} />}
			>
				Add New
			</Button>
			<TorrentAddModal isOpen={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)} />
		</>
	)
})
