import { ScrollShadow, Tab, Tabs } from '@heroui/react'
import { memo } from 'react'
import { TorrentDetailsFiles } from './TorrentDetailsFiles'
import { TorrentDetailsGeneral } from './TorrentDetailsGeneral'
import { TorrentDetailsPeers } from './TorrentDetailsPeers'
import { TorrentDetailsTracker } from './TorrentDetailsTracker'

export const TorrentDetails = memo(({ torrentHash }: { torrentHash?: string }) => (
	<Tabs
		aria-label="Tabs"
		classNames={{
			tabWrapper: 'h-full relative',
			base: 'sticky bottom-0 m-4 z-10 bg-background',
			tabList: 'shadow-lg',
		}}
		radius="full"
		placement="bottom"
		destroyInactiveTabPanel
	>
		<Tab key="general" title="General" className="h-full">
			<ScrollShadow className="w-full h-full">
				<TorrentDetailsGeneral torrentHash={torrentHash} />
			</ScrollShadow>
		</Tab>
		<Tab key="trackers" title="Trackers" className="h-full">
			<ScrollShadow className="w-full h-full">
				<TorrentDetailsTracker torrentHash={torrentHash} />
			</ScrollShadow>
		</Tab>
		<Tab key="peers" title="Peers" className="h-full">
			<ScrollShadow className="w-full h-full">
				<TorrentDetailsPeers torrentHash={torrentHash} />
			</ScrollShadow>
		</Tab>
		<Tab key="content" title="Content" className="h-full">
			<ScrollShadow className="w-full h-full">
				<TorrentDetailsFiles torrentHash={torrentHash} />
			</ScrollShadow>
		</Tab>
	</Tabs>
))
