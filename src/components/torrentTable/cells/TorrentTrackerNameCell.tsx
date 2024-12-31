import { AitherTrackerChip } from '@/components/trackerChips/AitherTrackerChip'
import { AnimeTorrentsTrackerChip } from '@/components/trackerChips/AnimeTorrentsTrackerChip'
import { BlutopiaTrackerChip } from '@/components/trackerChips/BlutopiaTrackerChip'
import { DefaultTrackerChip } from '@/components/trackerChips/DefaultTrackerChip'
import { FeerNoPeerTrackerChip } from '@/components/trackerChips/FeerNoPeerTrackerChip'
import { HunoTrackerChip } from '@/components/trackerChips/HunoTrackerChip'
import { YoinkedTrackerChip } from '@/components/trackerChips/YoinkedTrackerChip'
import { memo } from 'react'

const trackerHostnameToChip: Record<string, React.ReactNode> = {
	'blutopia.cc': <BlutopiaTrackerChip />,
	'aither.cc': <AitherTrackerChip />,
	'fearnopeer.com': <FeerNoPeerTrackerChip />,
	'yoinked.org': <YoinkedTrackerChip />,
	'hawke.uno': <HunoTrackerChip />,
	'animetorrents.me': <AnimeTorrentsTrackerChip />,
}

export const TorrentTrackerNameCell = memo(({
	trackerUrl,
}: {
	trackerUrl?: string
}) => {
	const trackerHostname = trackerUrl ? new URL(trackerUrl).hostname : ''
	const chip = trackerHostnameToChip[trackerHostname]

	return chip || <DefaultTrackerChip trackerHostname={trackerHostname} />
})
