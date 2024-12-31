import type {
	QbittorrentAddTorrentCommonInput,
	QbittorrentAddTorrentFromFileInput,
	QbittorrentAddTorrentFromMagnetInput,
} from '@/api/useAddTorrents'
import type {
	ModalProps,
	Selection,
	SelectItemProps,
} from '@nextui-org/react'
import type {
	ChangeEvent,
	FormEvent,
} from 'react'
import {
	useAddTorrents,
} from '@/api/useAddTorrents'
import { useGetCategories } from '@/api/useGetCategories'
import { useGetTags } from '@/api/useGetTags'
import {
	Button,
	Checkbox,
	Divider,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	Form,
	Input,
	Select,
	SelectItem,
	Tab,
	Tabs,
	Textarea,
} from '@nextui-org/react'
import {
	memo,
	useCallback,
	useEffect,
	useState,
} from 'react'

export const TorrentAddModal = memo(({
	isOpen,
	onOpenChange,
}: Pick<ModalProps, 'isOpen' | 'onOpenChange'>) => {
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
	const [selectedTags, setSelectedTags] = useState<Selection>(new Set([]))
	const [addTorrent, isLoading] = useAddTorrents()
	const [categoriesOptions, setCategoriesOptions] = useState<SelectItemProps[]>(
		[],
	)
	const [tagsOptions, setTagsOptions] = useState<SelectItemProps[]>([])
	const [getCategories, isLoadingCategories] = useGetCategories()
	const [getTags, isLoadingTags] = useGetTags()

	const refreshCategories = useCallback(async () => {
		const categories = await getCategories()
		setCategoriesOptions(
			Object.entries(categories).map(([key, value]) => ({
				key,
				value: value.name,
				children: value.name,
			})),
		)
	}, [getCategories])
	const refreshTags = useCallback(async () => {
		const tags = await getTags()
		setTagsOptions(
			tags.map(tag => ({
				key: tag,
				value: tag,
				children: tag,
			})),
		)
	}, [getTags])

	useEffect(() => {
		if (isOpen) {
			refreshCategories()
		}
	}, [refreshCategories, isOpen])

	useEffect(() => {
		if (isOpen) {
			refreshTags()
		}
	}, [refreshTags, isOpen])

	const handSubmit = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			const tags = Array.from(selectedTags).map(t => t.toString())
			const data = Object.fromEntries(new FormData(e.currentTarget))
			const payload: QbittorrentAddTorrentCommonInput = {
				addToTopOfQueue: 'addToTop' in data,
				autoTMM: 'automaticManagement' in data,
				category: 'category' in data ? data.category.toString() : undefined,
				contentLayout:
					'contentLayout' in data
						? (data.contentLayout.toString() as
							| 'Original'
							| 'Subfolder'
							| 'NoSubfolder')
						: undefined,
				cookie: 'cookie' in data ? data.cookie.toString() : undefined,
				dlLimit:
					'downloadSpeedLimit' in data
						? Number(data.downloadSpeedLimit)
						: undefined,
				firstLastPiecePrio: 'firstLastPiecesFirst' in data,
				paused: !('startNow' in data),
				ratioLimit: 'ratioLimit' in data ? Number(data.ratioLimit) : undefined,
				rename:
					'renameTorrent' in data ? data.renameTorrent.toString() : undefined,
				root_folder: 'rootFolder' in data,
				savepath:
					'saveLocation' in data ? data.saveLocation.toString() : undefined,
				seedingTimeLimit:
					'seedingTimeLimit' in data
						? Number(data.seedingTimeLimit)
						: undefined,
				sequentialDownload: 'sequentialDownload' in data,
				skip_checking: 'skipHashChecking' in data,
				tags: tags.length > 0 ? tags : undefined,
				upLimit:
					'uploadSpeedLimit' in data
						? Number(data.uploadSpeedLimit)
						: undefined,
			}

			if ('urls' in data) {
				(payload as QbittorrentAddTorrentFromMagnetInput).urls = data.urls
					.toString()
					.split('\n')
				await addTorrent(payload as QbittorrentAddTorrentFromMagnetInput)
			}
			if (selectedFiles && selectedFiles.length > 0) {
				(payload as QbittorrentAddTorrentFromFileInput).torrents
					= selectedFiles
				await addTorrent(payload as QbittorrentAddTorrentFromFileInput)
			}
		},
		[addTorrent, selectedTags, selectedFiles],
	)
	const handleFileChanged = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setSelectedFiles(e.target.files)
		},
		[setSelectedFiles],
	)

	return (
		<Drawer
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			classNames={{ base: 'md:m-3 sm:rounded-none md:rounded-lg' }}
		>
			<DrawerContent>
				{onClose => (
					<>
						<Form onSubmit={handSubmit} className="h-full">
							<DrawerHeader className="flex flex-col gap-1">
								Add a new torrent
							</DrawerHeader>
							<DrawerBody className="w-full">
								<Tabs>
									<Tab key="file" title="File">
										<Input
											label="Torrent file(s)"
											type="file"
											accept="application/x-bittorrent"
											onChange={handleFileChanged}
											multiple
											required
										/>
									</Tab>
									<Tab key="magnet" title="Magnets/URLs">
										<Textarea
											name="urls"
											label="URLs (one per line)"
											required
										/>
									</Tab>
								</Tabs>
								<Divider />
								<Checkbox name="automaticManagement" defaultSelected>
									Automatic torrent management
								</Checkbox>
								<Checkbox name="startNow">Start torrents</Checkbox>
								<Checkbox name="addToTop">Add to top of queue</Checkbox>
								<Checkbox name="sequentialDownload">
									Download in sequential order
								</Checkbox>
								<Checkbox name="firstLastPiecesFirst">
									Download first and last piece first
								</Checkbox>
								<Checkbox name="rootFolder">Create the root folder</Checkbox>
								<Checkbox name="skipHashChecking">Skip hash checking</Checkbox>
								<Input name="saveLocation" label="Save files to location" />
								<Input name="cookie" label="Cookie" />
								<Input name="renameTorrent" label="Rename torrent" />
								<Select
									name="category"
									label="Category"
									isLoading={isLoadingCategories}
								>
									{categoriesOptions.map(option => (
										<SelectItem {...option} key={option.key} />
									))}
								</Select>
								<Select
									label="Tags"
									defaultSelectedKeys={['none']}
									selectedKeys={selectedTags}
									onSelectionChange={setSelectedTags}
									selectionMode="multiple"
									autoCapitalize="on"
									isLoading={isLoadingTags}
								>
									{tagsOptions.map(option => (
										<SelectItem {...option} key={option.key} />
									))}
								</Select>
								<Select
									name="stopCondition"
									label="Stop condition"
									defaultSelectedKeys={['None']}
								>
									<SelectItem key="None">None</SelectItem>
									<SelectItem key="MetadataReceived">
										Metadata received
									</SelectItem>
									<SelectItem key="FilesChecked">Files checked</SelectItem>
								</Select>
								<Select
									label="Content layout"
									name="contentLayout"
									defaultSelectedKeys={['Original']}
								>
									<SelectItem key="Original">Original</SelectItem>
									<SelectItem key="Subfolder">Create subfolder</SelectItem>
									<SelectItem key="NoSubfolder">
										Don't create subfolder
									</SelectItem>
								</Select>
								<Input
									name="downloadSpeedLimit"
									label="Limit download speed (0 for unlimited)"
									type="number"
									defaultValue="0"
									endContent={<span className="whitespace-nowrap">KiB/s</span>}
								/>
								<Input
									name="uploadSpeedLimit"
									label="Limit upload speed (0 for unlimited)"
									type="number"
									defaultValue="0"
									endContent={<span className="whitespace-nowrap">KiB/s</span>}
								/>
								<Input
									name="ratioLimit"
									label="Limit share ratio (-1 for unlimited)"
									type="number"
									defaultValue="-1"
								/>
								<Input
									name="seedingTimeLimit"
									label="Limit share duration (-1 for unlimited)"
									type="number"
									defaultValue="-1"
									endContent={
										<span className="whitespace-nowrap">minutes</span>
									}
								/>
							</DrawerBody>
							<DrawerFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Cancel
								</Button>
								<Button color="primary" type="submit" isLoading={isLoading}>
									Add torrent(s)
								</Button>
							</DrawerFooter>
						</Form>
					</>
				)}
			</DrawerContent>
		</Drawer>
	)
})
