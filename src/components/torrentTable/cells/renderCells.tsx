import type { QBittorrentTorrentState } from '@/types/QBittorrentTorrentState'
import type { TORRENT_TABLE_COLUMNS } from '../TorrentTableColumns'
import { TorrentBitrateCell } from './TorrentBitrateCell'
import { TorrentETACell } from './TorrentETACell'
import { TorrentNameCell } from './TorrentNameCell'
import { TorrentNumberCell } from './TorrentNumberCell'
import { TorrentPriorityCell } from './TorrentPriorityCell'
import { TorrentProgressCell } from './TorrentProgressCell'
import { TorrentSizeCell } from './TorrentSizeCell'
import { TorrentStatusCell } from './TorrentStateCell'
import { TorrentTimestampCell } from './TorrentTimestampCell'
import { TorrentTrackerNameCell } from './TorrentTrackerNameCell'

export function renderCell(
	columnKey: (typeof TORRENT_TABLE_COLUMNS)[number]['uid'],
	cellValue: any,
	torrentState: QBittorrentTorrentState,
	torrentNumComplete: number | undefined,
	torrentNumIncomplete: number | undefined,
	torrentIsNew: boolean,
) {
	switch (columnKey) {
		case 'normalized_priority': return <TorrentPriorityCell priority={cellValue as number} />
		case 'state': return <TorrentStatusCell isNew={torrentIsNew} state={cellValue as QBittorrentTorrentState} />
		case 'name': return <TorrentNameCell name={cellValue as string} />
		case 'dlspeed': return <TorrentBitrateCell bitrate={cellValue as number} />
		case 'downloaded': return <TorrentSizeCell size={cellValue as number} />
		case 'downloaded_session': return <TorrentSizeCell size={cellValue as number} />
		case 'upspeed': return <TorrentBitrateCell bitrate={cellValue as number} />
		case 'uploaded': return <TorrentSizeCell size={cellValue as number} />
		case 'uploaded_session': return <TorrentSizeCell size={cellValue as number} />
		case 'completed': return <TorrentSizeCell size={cellValue as number} />
		case 'total_size': return <TorrentSizeCell size={cellValue as number} />
		case 'num_seeds': return <span>{`${cellValue} (${torrentNumComplete})`}</span>
		case 'num_leechs': return <span>{`${cellValue} (${torrentNumIncomplete})`}</span>
		case 'availability': return <TorrentNumberCell value={cellValue as number} />
		case 'popularity': return <TorrentNumberCell value={cellValue as number} />
		case 'ratio': return <TorrentNumberCell value={cellValue as number} />
		case 'ratio_limit': return <TorrentNumberCell value={cellValue as number} />
		case 'max_ratio': return <TorrentNumberCell value={cellValue as number} />
		case 'category': return <span>{cellValue}</span>
		case 'tags': return <span>{cellValue}</span>
		case 'eta': return <TorrentETACell value={cellValue as number} />
		case 'completion_on': return <TorrentTimestampCell timestamp={cellValue as number} />
		case 'added_on': return <TorrentTimestampCell timestamp={cellValue as number} />
		case 'progress': return <TorrentProgressCell progress={cellValue as number} torrentState={torrentState} />
		case 'tracker': return <TorrentTrackerNameCell trackerUrl={cellValue as string} />
		default: return cellValue
	}
}
