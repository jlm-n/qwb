import { Button } from '@heroui/button'
import { IconRefresh } from '@tabler/icons-react'
import { memo } from 'react'

export const TorrentRefreshButtons = memo(({
	isRefreshing,
	autoRefreshEnabled,
	onIncrementalTorrentRefresh,
	onAutoRefreshChange,
}: {
	isRefreshing: boolean
	autoRefreshEnabled: boolean
	onIncrementalTorrentRefresh: () => void
	onAutoRefreshChange: (autoRefreshEnabled: boolean) => void
}) => (
	<>
		{!autoRefreshEnabled && (
			<Button isDisabled={isRefreshing} onPress={onIncrementalTorrentRefresh}>
				Refresh
			</Button>
		)}
		<Button
			isIconOnly
			aria-label="Refresh"
			isLoading={!autoRefreshEnabled && isRefreshing}
			color={autoRefreshEnabled ? 'primary' : 'default'}
			onPress={() => onAutoRefreshChange(!autoRefreshEnabled)}
		>
			<IconRefresh width={20} />
		</Button>
	</>
))
