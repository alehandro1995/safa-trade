import Header from '@/components/Header'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
		<section>
			<Header />
			{children}
		</section>
	)
}