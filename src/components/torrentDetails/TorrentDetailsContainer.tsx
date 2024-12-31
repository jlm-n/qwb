export function TorrentDetailsContainer({
	children,
}: {
	children: React.ReactElement | React.ReactElement[]
}) {
	return <div className="flex flex-col gap-4 p-4 mb-10">{children}</div>
}
