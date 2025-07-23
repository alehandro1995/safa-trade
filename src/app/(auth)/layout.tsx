export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
		<section className="px-5">
			{children}
		</section>
	)
}