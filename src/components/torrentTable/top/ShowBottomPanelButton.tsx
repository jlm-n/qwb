import { Button } from '@heroui/button'
import { IconBoxAlignBottomFilled } from '@tabler/icons-react'
import { memo } from 'react'

export const ShowBottomPanelButton = memo(
	({
		showBottomPanel,
		onShowBottomPanelChange,
	}: {
		showBottomPanel: boolean
		onShowBottomPanelChange: (showBottomPanel: boolean) => void
	}) => (
		<Button
			isIconOnly
			aria-label="Show bottom panel"
			color={showBottomPanel ? 'primary' : 'default'}
			onPress={() => onShowBottomPanelChange(!showBottomPanel)}
		>
			<IconBoxAlignBottomFilled width={20} />
		</Button>
	)
)
