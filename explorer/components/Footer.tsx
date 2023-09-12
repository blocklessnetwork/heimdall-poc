import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

export default function Footer() {
	return (
		<>
			<div className="flex-col md:flex">
				<Separator />
				<div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
					<div className="flex items-center">© 2023 Copyright reserved.</div>
					<div className="flex items-center">
						<div className="flex items-center">
							built with&nbsp;
							<a href="https://blockless.network/" target="_blank" rel="noopener noreferrer">
								Blockless
							</a>
							<Image src="/bls-logo.png" width={24} height={24} alt="Blockless" className="ml-3" />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
