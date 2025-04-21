import { memo } from 'react'

export const TorrentNumberCell = memo(({ value }: { value: number }) => <span>{value < 0 ? '∞' : value.toFixed(2)}</span>)
