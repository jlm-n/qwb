import { memo } from 'react'
import { PanelResizeHandle as RPH } from 'react-resizable-panels'

export const PanelResizeHandle = memo(() => (
	<RPH className="rounded-lg h-4 mx-3 transition [&[data-resize-handle-active]]:bg-divider hover:bg-gray-100 dark:hover:bg-gray-800 flex">
		<div className="m-auto rounded justify-center align-middle h-2 w-20 bg-divider" />
	</RPH>
))
