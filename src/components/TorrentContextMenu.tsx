import type { QBittorrentTorrent } from '@/types/QBittorrentTorrent'
import { useDecreaseTorrentPrio } from '@/api/useDecreaseTorrentPrio'
import { useForceStartTorrents } from '@/api/useForceStartTorrent'
import { useIncreaseTorrentPrio } from '@/api/useIncreaseTorrentPrio'
import { useReannounceTorrents } from '@/api/useReannounceTorrents'
import { useRecheckTorrents } from '@/api/useRecheckTorrent'
import { useSetTorrentBottomPrio } from '@/api/useSetTorrentBottomPrio'
import { useSetTorrentTopPrio } from '@/api/useSetTorrentTopPrio'
import { useStartTorrents } from '@/api/useStartTorrent'
import { useStopTorrents } from '@/api/useStopTorrent'
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Spinner,
} from '@heroui/react'
import {
	IconArrowBarToDown,
	IconArrowBarToUp,
	IconArrowDown,
	IconArrowUp,
	IconDotsVertical,
	IconFileDownload,
	IconPencil,
	IconPlayerPlay,
	IconPlayerPlayFilled,
	IconPlayerStop,
	IconRecycle,
	IconSpeakerphone,
	IconTrash,
	IconTrashX,
	IconTruckDelivery,
} from '@tabler/icons-react'
import { memo, useMemo, useState } from 'react'
import { TorrentChangeLocationModal } from './TorrentChangeLocationModal'
import { TorrentRemoveConfirmationModal } from './TorrentRemoveConfirmationModal'
import { TorrentRenameModal } from './TorrentRenameModal'

const DEFAULT_TORRENT_HASHES: string[] = []

export const TorrentContextMenu = memo(({
	torrentHashes = DEFAULT_TORRENT_HASHES,
	torrents,
	isOpen,
	onClose,
	position,
	triggerRef,
}: {
	torrentHashes?: string[]
	torrents?: Map<string, QBittorrentTorrent>
	isOpen?: boolean
	onClose?: () => void
	position?: { x: number, y: number }
	triggerRef?: React.RefObject<HTMLElement>
}) => {
	const [startTorrent, isStartTorrentLoading] = useStartTorrents()
	const [forceStartTorrent, isForceStartTorrentLoading] = useForceStartTorrents()
	const [stopTorrent, isStopTorrentLoading] = useStopTorrents()
	const [deleteTorrentModalIsOpen, setDeleteTorrentModalIsOpen] = useState(false)
	const [deleteTorrentFilesModalIsOpen, setDeleteTorrentFilesModalIsOpen] = useState(false)
	const [changeTorrentLocationModalIsOpen, setChangeTorrentLocationModalIsOpen] = useState(false)
	const [renameTorrentModalIsOpen, setRenameTorrentModalIsOpen] = useState(false)
	const [recheckTorrents, recheckTorrentsLoading] = useRecheckTorrents()
	const [reannounceTorrents, reannounceTorrentsLoading] = useReannounceTorrents()
	const [setTorrentTopPrio, isSetTorrentTopPrioLoading] = useSetTorrentTopPrio()
	const [setTorrentBottomPrio, isSetTorrentBottomPrioLoading] = useSetTorrentBottomPrio()
	const [increaseTorrentPrio, isIncreaseTorrentPrioLoading] = useIncreaseTorrentPrio()
	const [decreaseTorrentPrio, isDecreaseTorrentPrioLoading] = useDecreaseTorrentPrio()
	const selectedTorrents = useMemo(() => torrentHashes.map(hash => torrents?.get(hash)), [torrentHashes, torrents])

	return (
		<>
			<Dropdown
				isOpen={isOpen}
				closeOnSelect={false}
				onClose={onClose}
				style={{
					zIndex: '10',
					translate: (position?.x || 0) - ((triggerRef?.current?.getBoundingClientRect().width || 0) / 2),
				}}
				triggerRef={triggerRef}
			>
				<DropdownTrigger>
					{onClose
						? <></>
						: <Button isDisabled={!torrentHashes || torrentHashes.length < 1} isIconOnly><IconDotsVertical /></Button>}
				</DropdownTrigger>
				<DropdownMenu disabledKeys={torrentHashes && torrentHashes.length > 1 ? ['export', 'rename'] : undefined}>
					<DropdownSection showDivider>
						<DropdownItem
							key="start"
							endContent={
								isStartTorrentLoading ? <Spinner size="sm" /> : undefined
							}
							startContent={<IconPlayerPlay width={16} />}
							onPress={async () => await startTorrent(torrentHashes)}
						>
							Start
						</DropdownItem>
						<DropdownItem
							key="force-start"
							endContent={
								isForceStartTorrentLoading ? <Spinner size="sm" /> : undefined
							}
							startContent={<IconPlayerPlayFilled width={16} />}
							onPress={async () => await forceStartTorrent(torrentHashes)}
						>
							Force start
						</DropdownItem>
						<DropdownItem
							key="stop"
							endContent={
								isStopTorrentLoading ? <Spinner size="sm" /> : undefined
							}
							startContent={<IconPlayerStop width={16} />}
							onPress={async () => await stopTorrent(torrentHashes)}
						>
							Stop
						</DropdownItem>
					</DropdownSection>
					<DropdownSection showDivider>
						<DropdownItem
							key="remove"
							color="danger"
							startContent={<IconTrash width={16} />}
							onPress={() => setDeleteTorrentModalIsOpen(true)}
						>
							Remove
						</DropdownItem>

						<DropdownItem
							key="remove-files"
							color="danger"
							startContent={<IconTrashX width={16} />}
							onPress={() => setDeleteTorrentFilesModalIsOpen(true)}
						>
							Remove w. Files
						</DropdownItem>
					</DropdownSection>
					<DropdownSection showDivider>
						<DropdownItem
							key="change-location"
							color="primary"
							startContent={<IconTruckDelivery width={16} />}
							onPress={() => setChangeTorrentLocationModalIsOpen(true)}
						>
							Set location
						</DropdownItem>
						<DropdownItem
							key="rename"
							startContent={<IconPencil width={16} />}
							onPress={() => setRenameTorrentModalIsOpen(true)}
						>
							Rename
						</DropdownItem>
					</DropdownSection>
					<DropdownSection showDivider>
						<DropdownItem
							key="move-to-top"
							startContent={<IconArrowBarToUp width={16} />}
							endContent={
								isSetTorrentTopPrioLoading ? <Spinner size="sm" /> : undefined
							}
							onPress={async () => await setTorrentTopPrio(torrentHashes)}
						>
							Move to top
						</DropdownItem>
						<DropdownItem
							key="move-up"
							startContent={<IconArrowUp width={16} />}
							endContent={
								isIncreaseTorrentPrioLoading ? <Spinner size="sm" /> : undefined
							}
							onPress={async () => await increaseTorrentPrio(torrentHashes)}
						>
							Move up
						</DropdownItem>
						<DropdownItem
							key="move-down"
							startContent={<IconArrowDown width={16} />}
							endContent={
								isDecreaseTorrentPrioLoading ? <Spinner size="sm" /> : undefined
							}
							onPress={async () => await decreaseTorrentPrio(torrentHashes)}
						>
							Move down
						</DropdownItem>
						<DropdownItem
							key="move-to-bottom"
							startContent={<IconArrowBarToDown width={16} />}
							endContent={
								isSetTorrentBottomPrioLoading ? <Spinner size="sm" /> : undefined
							}
							onPress={async () => await setTorrentBottomPrio(torrentHashes)}
						>
							Move to bottom
						</DropdownItem>
					</DropdownSection>
					<DropdownSection showDivider>
						<DropdownItem
							key="recheck"
							endContent={
								recheckTorrentsLoading ? <Spinner size="sm" /> : undefined
							}
							startContent={<IconRecycle width={16} />}
							onPress={async () => await recheckTorrents(torrentHashes)}
						>
							Re-check
						</DropdownItem>
						<DropdownItem
							key="reannounce"
							endContent={
								reannounceTorrentsLoading ? <Spinner size="sm" /> : undefined
							}
							startContent={<IconSpeakerphone width={16} />}
							onPress={async () => await reannounceTorrents(torrentHashes)}
						>
							Re-announce
						</DropdownItem>
					</DropdownSection>
					<DropdownItem
						key="export"
						download={`${selectedTorrents.at(0)?.name}.torrent`}
						href={`/api/v2/torrents/export?hash=${torrentHashes[0]}`}
						startContent={<IconFileDownload width={16} />}
					>
						Export
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<TorrentRemoveConfirmationModal
				isOpen={deleteTorrentModalIsOpen}
				torrentHashes={torrentHashes}
				onClose={() => setDeleteTorrentModalIsOpen(false)}
			/>
			<TorrentRemoveConfirmationModal
				withFiles
				isOpen={deleteTorrentFilesModalIsOpen}
				torrentHashes={torrentHashes}
				onClose={() => setDeleteTorrentFilesModalIsOpen(false)}
			/>
			<TorrentChangeLocationModal
				currentLocation={selectedTorrents.at(0)?.save_path ?? ''}
				currentName={selectedTorrents.at(0)?.name ?? ''}
				isOpen={changeTorrentLocationModalIsOpen}
				torrentHashes={torrentHashes}
				onClose={() => setChangeTorrentLocationModalIsOpen(false)}
			/>
			<TorrentRenameModal
				currentName={selectedTorrents.at(0)?.name ?? ''}
				isOpen={renameTorrentModalIsOpen}
				torrentHash={torrentHashes[0]}
				onClose={() => setRenameTorrentModalIsOpen(false)}
			/>
		</>
	)
})
