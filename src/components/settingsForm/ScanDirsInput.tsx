import type { QBittorrentPreferences } from '@/types/QBittorrentPreferences'
import { QBittorrentPreferencesScanDirMode } from '@/types/QBittorrentPreferences'
import { Input } from '@nextui-org/input'
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table'
import { IconTrash } from '@tabler/icons-react'
import { useCallback, useState } from 'react'

export function ScanDirsInput({ scan_dirs }: Pick<QBittorrentPreferences, 'scan_dirs'>) {
	const [scanDirsStringState/* , setScanDirsStringState */] = useState(JSON.stringify(scan_dirs))
	const [scanDirsState, setScanDirsState] = useState(Object.entries(scan_dirs || {}))

	// const addFolderCallback = useCallback(() => {
	// 	setScanDirsState((previous) => {
	// 		previous.push(['', QBittorrentPreferencesScanDirMode.DOWNLOAD_TO_DEFAULT_SAVE_PATH])
	// 		console.error(previous)
	// 		return [...previous]
	// 	})
	// }, [])
	const deleteKeyCallback = useCallback((key: string) => {
		console.error(key)
		setScanDirsState((previous) => {
			return [...previous.filter(([folderName]) => folderName !== key)]
		})
	}, [])

	return (
		<>
			<input name="scan_dirs" value={scanDirsStringState} readOnly hidden />
			<Table
				aria-label="Directories to scan"
				removeWrapper
			// bottomContent={<Button size="sm" className="w-fit !rounded" variant="light" onPress={addFolderCallback}>Add folder</Button>}
			>
				<TableHeader>
					<TableColumn>Folder</TableColumn>
					<TableColumn>Save path override</TableColumn>
					<TableColumn aria-label="actions" children="" />
				</TableHeader>
				<TableBody>
					{scanDirsState.map(([key, value], index) => (
						<TableRow key={key}>
							<TableCell width="50%"><Input name={`scan_dirs.${index}.location`} isReadOnly aria-label="Folder location" defaultValue={key} variant="bordered" /></TableCell>
							<TableCell>
								<Autocomplete
									readOnly
									allowsCustomValue
									className="max-w-xs"
									aria-label="Save location override"
									variant="bordered"
									name={`scan_dirs.${index}.override`}
									// onSelectionChange={(e) => {
									// 	console.error(e)
									// }}
									// onValueChange={e => console.error(e)}
									defaultInputValue={value && !QBittorrentPreferencesScanDirMode[value as QBittorrentPreferencesScanDirMode] ? undefined : value.toString()}
									defaultSelectedKey={value && QBittorrentPreferencesScanDirMode[value as QBittorrentPreferencesScanDirMode] ? value.toString() : undefined}
								>
									<AutocompleteItem key={QBittorrentPreferencesScanDirMode.DOWNLOAD_TO_MONITORED_FOLDER.toString()}>
										Monitored folder
									</AutocompleteItem>
									<AutocompleteItem key={QBittorrentPreferencesScanDirMode.DOWNLOAD_TO_DEFAULT_SAVE_PATH.toString()}>
										Default save path
									</AutocompleteItem>
								</Autocomplete>
							</TableCell>
							<TableCell>
								<Button size="sm" isIconOnly isDisabled onPress={() => deleteKeyCallback(key)}><IconTrash width={16} /></Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	)
}
