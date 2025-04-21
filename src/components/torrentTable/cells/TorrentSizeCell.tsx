import prettyBytes from 'pretty-bytes'
import { memo } from 'react'

export const TorrentSizeCell = memo(({ size }: { size: number }) => <span>{size > 0 ? prettyBytes(size) : ''}</span>)
