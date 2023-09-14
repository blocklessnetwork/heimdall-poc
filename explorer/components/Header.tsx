import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import ConnectWallet from './ConnectWallet'

export default function Header() {
	return (
		<>
			<div className="flex-col md:flex">
				<div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
					<div>
						<Link href="/" className="flex items-center">
							<Image src="/hm-logo.png" width={32} height={32} alt="Heimdall" className="mr-3" />
							<h2 className="text-lg font-semibold whitespace-nowrap">Heimdall</h2>
						</Link>
					</div>
					<div className="flex gap-4 items-center">
						<Link href="/guardians">Guardian Registry</Link>
						<ConnectWallet />
					</div>
				</div>
				<Separator />
			</div>
		</>
	)
}
