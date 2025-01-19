import type { QBittorrentPreferences } from '@/types/QBittorrentPreferences'
import { Checkbox, Divider, Input, Textarea } from '@heroui/react'
import { memo, useState } from 'react'

export const RSSSettingsSection = memo(({
	rss_processing_enabled,
	rss_refresh_interval,
	rss_fetch_delay,
	rss_max_articles_per_feed,
	rss_auto_downloading_enabled,
	rss_download_repack_proper_episodes,
	rss_smart_episode_filters,

}: Pick<
	QBittorrentPreferences,
	'rss_processing_enabled'
	| 'rss_refresh_interval'
	| 'rss_fetch_delay'
	| 'rss_max_articles_per_feed'
	| 'rss_auto_downloading_enabled'
	| 'rss_download_repack_proper_episodes'
	| 'rss_smart_episode_filters'
>) => {
	const [rssProcessingEnabledState, setRSSProcessingEnabledState] = useState(rss_processing_enabled)

	return (
		<>
			<Checkbox name="rss_processing_enabled" isSelected={rssProcessingEnabledState} onValueChange={setRSSProcessingEnabledState}>Enable fetching RSS feeds</Checkbox>
			<Input
				name="rss_refresh_interval"
				label="RSS feeds refresh interval"
				isDisabled={!rssProcessingEnabledState}
				defaultValue={rss_refresh_interval?.toString()}
				type="number"
				endContent={<p className="text-nowrap">minutes</p>}
			/>
			<Input
				name="rss_fetch_delay"
				label="RSS feeds same host fetch delay"
				isDisabled={!rssProcessingEnabledState}
				defaultValue={rss_fetch_delay?.toString()}
				type="number"
				endContent={<p className="text-nowrap">seconds</p>}
			/>
			<Input
				name="rss_max_articles_per_feed"
				label="Maximum number of articles per feed"
				isDisabled={!rssProcessingEnabledState}
				defaultValue={rss_max_articles_per_feed?.toString()}
				type="number"
			/>
			<Divider className="my-2" />

			<Checkbox name="rss_auto_downloading_enabled" defaultSelected={rss_auto_downloading_enabled}>Enable auto downloading of RSS torrents</Checkbox>
			<Divider className="my-2" />

			<Checkbox name="rss_download_repack_proper_episodes" defaultSelected={rss_download_repack_proper_episodes}>Download REPACK/PROPER episodes</Checkbox>
			<Textarea name="rss_smart_episode_filters" label="RSS filters (1 per line)" defaultValue={rss_smart_episode_filters} />
			<Divider className="my-2" />
		</>
	)
})
