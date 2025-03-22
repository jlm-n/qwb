import type { QBittorrentTorrentFile } from '@/types/QBittorrentTorrentFile'
import type {
	Selection,

	SortDescriptor,
} from '@heroui/react'

import {
	useGetTorrentFiles,
} from '@/api/useGetTorrentFiles'
import { useRenameFile } from '@/api/useRenameFile'
import { useRenameFolder } from '@/api/useRenameFolder'
import { useSetFilePriority } from '@/api/useSetFilePriority'
import { useSettings } from '@/contexts/SettingsContext'

import { QBittorrentFilePriority } from '@/types/QBittorrentTorrentFile'
import {
	BreadcrumbItem,
	Breadcrumbs,
	Button,
	Input,
	Link,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectItem,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react'
import { IconDeviceFloppy, IconWand } from '@tabler/icons-react'
import prettyBytes from 'pretty-bytes'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TorrentProgressCell } from '../torrentTable/cells/TorrentProgressCell'
import { normalizeFileName } from '../torrentTable/normalizeTorrentName'

const PRIORITY_TO_STRING: Record<QBittorrentFilePriority, string> = {
	[QBittorrentFilePriority.DO_NOT_DOWNLOAD]: 'Do not download',
	[QBittorrentFilePriority.NORMAL]: 'Normal',
	[QBittorrentFilePriority.HIGHT]: 'High',
	[QBittorrentFilePriority.MAXIMAL]: 'Maximal',
}

const TorrentPriorityCell = memo(({ torrentHash, fileId, priority }: { torrentHash?: string, fileId: string, priority: QBittorrentFilePriority }) => {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([priority]))
	const [setFilePriority, isLoading] = useSetFilePriority()
	const onPressCallback = useCallback(async () => {
		if (torrentHash && selectedKeys !== 'all') {
			await setFilePriority(torrentHash, [fileId], selectedKeys.values().next().value as QBittorrentFilePriority)
		}
	}, [torrentHash, fileId, selectedKeys, setFilePriority])

	return (
		<Popover>
			<PopoverTrigger><Link className="cursor-pointer" color="foreground" size="sm">{PRIORITY_TO_STRING[priority] ?? priority}</Link></PopoverTrigger>
			<PopoverContent className="p-3 w-full flex flex-row gap-3 items-center">
				<Select
					className="w-40"
					label="New priority"
					size="sm"
					variant="bordered"
					selectedKeys={selectedKeys}
					onSelectionChange={setSelectedKeys}
				>
					{Object.entries(PRIORITY_TO_STRING).map(([key, value]) => (
						<SelectItem key={key}>{value}</SelectItem>
					))}
				</Select>
				<Button title="Save new priority" isDisabled={!torrentHash} isIconOnly radius="sm" isLoading={isLoading} onPress={onPressCallback}><IconDeviceFloppy /></Button>
			</PopoverContent>
		</Popover>
	)
})

const FileNameCell = memo(({ fileName, onNamePressed }: { fileName: string, onNamePressed: (target: HTMLElement, path: string, fullPath: string) => void }) => (
	<Breadcrumbs>
		{fileName.split('/').map((item, i, array) => {
			if (item !== array.at(-1)) {
				return (
					<BreadcrumbItem
						key={item}
						onPress={(e) => {
							onNamePressed(e.target as HTMLElement, array.slice(0, i + 1).join('/'), fileName)
						}}
					>
						{item}
					</BreadcrumbItem>
				)
			}
			return (
				<BreadcrumbItem classNames={{ item: 'cursor-pointer' }} key={item}>
					<Link
						size="sm"
						color="foreground"
						onPress={(e) => {
							onNamePressed(e.target as HTMLElement, fileName, fileName)
						}}
					>
						{item}
					</Link>
				</BreadcrumbItem>
			)
		})}
	</Breadcrumbs>
))

export function TorrentDetailsFiles({
	torrentHash,
}: {
	torrentHash?: string
}) {
	const [getTorrentFiles] = useGetTorrentFiles()
	const [renameFolder, renameFolderLoading] = useRenameFolder()
	const [renameFile, renameFileLoading] = useRenameFile()
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
	const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState(false)
	const { torrentFilesRefreshRate } = useSettings()
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: 'index', direction: 'ascending' })
	const [files, setFiles] = useState<QBittorrentTorrentFile[] | undefined>()

	const refreshFiles = useCallback(async (torrentHash: string) => {
		const files = await getTorrentFiles(torrentHash)
		setFiles(files)
	}, [getTorrentFiles, setFiles])

	const [requestCounter, setRequestCounter] = useState(0)
	const refreshTorrentFiles = useCallback(async () => {
		if (torrentHash) {
			await refreshFiles(torrentHash)
		}
		setRequestCounter(prev => prev + 1)
	}, [torrentHash, refreshFiles, setRequestCounter])
	useEffect(() => {
		refreshTorrentFiles()
	}, [refreshTorrentFiles])
	useEffect(() => {
		const timeout = setTimeout(refreshTorrentFiles, torrentFilesRefreshRate)
		return () => clearTimeout(timeout)
	}, [refreshFiles, requestCounter, refreshTorrentFiles, torrentFilesRefreshRate])

	const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null)
	const [popoverTarget, setPopoverTarget] = useState<HTMLElement | null>(null)

	const popoverTargetRef = useRef<HTMLElement | null>(null)
	useEffect(() => {
		popoverTargetRef.current = popoverTarget
	}, [popoverTarget])

	const [oldPath, setOldPath] = useState('')
	const [newName, setNewName] = useState('')
	const [fullPath, setFullPath] = useState('')

	const onNamePressed = useCallback((target: HTMLElement, path: string, fullPath: string) => {
		setPopoverTarget(target)
		setFullPath(fullPath)
		setNewName(path.split('/').at(-1) || '')
		setOldPath(path)
		setIsRenamePopoverOpen(true)
	}, [setIsRenamePopoverOpen])

	useEffect(() => {
		if (inputElement && popoverTarget) {
			inputElement.style.width = `${Math.max(popoverTarget.getBoundingClientRect().width + 10, 100)}px`
			inputElement.select()
		}
	}, [inputElement, popoverTarget])

	const onSaveButtonPressed = useCallback(async () => {
		if (torrentHash && oldPath) {
			const p = oldPath.split('/')
			p.pop()
			p.push(newName)
			if (oldPath === fullPath) {
				await renameFile(torrentHash, oldPath, p.join('/'))
			}
			else {
				await renameFolder(torrentHash, oldPath, p.join('/'))
			}
			await refreshTorrentFiles()
			setIsRenamePopoverOpen(false)
		}
	}, [torrentHash, oldPath, renameFile, renameFolder, refreshTorrentFiles, setIsRenamePopoverOpen, newName, fullPath])

	const sortedFiles = useMemo(() => {
		return files?.sort((a, b) => {
			if (!sortDescriptor?.column) {
				return 0
			}
			const key = sortDescriptor?.column as keyof QBittorrentTorrentFile
			const cmp = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
			return sortDescriptor.direction === 'descending' ? -cmp : cmp
		})
	}, [files, sortDescriptor])

	return (
		<>
			<Table
				aria-label="Files information"
				isHeaderSticky
				isStriped
				classNames={{
					base: 'h-full overflow-auto px-4',
					table: 'mb-14',
				}}
				selectionMode="multiple"
				selectionBehavior="replace"
				selectedKeys={selectedKeys}
				onSelectionChange={setSelectedKeys}
				sortDescriptor={sortDescriptor}
				onSortChange={setSortDescriptor}
				removeWrapper
			>
				<TableHeader>
					<TableColumn width={50} allowsSorting key="index">INDEX</TableColumn>
					<TableColumn minWidth="100%" allowsSorting key="name">NAME</TableColumn>
					<TableColumn width={100} allowsSorting key="size">SIZE</TableColumn>
					<TableColumn width={100} allowsSorting key="progress">PROGRESS</TableColumn>
					<TableColumn width={50} allowsSorting key="availability">AVAIL.</TableColumn>
					<TableColumn width={150} allowsSorting key="priority">PRIORITY</TableColumn>
				</TableHeader>
				<TableBody items={sortedFiles || []}>
					{({ index, name, size, progress, availability, priority }) => (
						<TableRow key={index}>
							<TableCell>{index}</TableCell>
							<TableCell><FileNameCell fileName={name} onNamePressed={onNamePressed} /></TableCell>
							<TableCell>{prettyBytes(size)}</TableCell>
							<TableCell><TorrentProgressCell progress={progress} torrentState="unknown" /></TableCell>
							<TableCell>{availability.toFixed(2)}</TableCell>
							<TableCell><TorrentPriorityCell fileId={index.toString()} torrentHash={torrentHash} priority={priority} /></TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<Popover isOpen={isRenamePopoverOpen} crossOffset={45} onClose={() => setIsRenamePopoverOpen(false)} triggerRef={popoverTargetRef}>
				<PopoverTrigger><></></PopoverTrigger>
				<PopoverContent className="p-3 w-full flex flex-row gap-3 items-center">
					<Input
						ref={node => setInputElement(node)}
						label="New name"
						size="sm"
						variant="bordered"
						value={newName}
						endContent={<Button variant="light" isIconOnly size="sm" title="Normalize name" radius="sm" className="m-auto -mr-1" onPress={() => setNewName(normalizeFileName(newName))}><IconWand width={16} /></Button>}
						onValueChange={setNewName}
					/>
					<Button isLoading={renameFolderLoading || renameFileLoading} title="Save changes" isIconOnly radius="sm" onPress={onSaveButtonPressed}><IconDeviceFloppy /></Button>
				</PopoverContent>
			</Popover>
		</>
	)
}
