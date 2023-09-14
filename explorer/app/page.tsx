import KnownProtocols from '@/components/KnownProtocols'
import { Search } from '@/components/Search'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function Home() {
	return (
		<div className="h-full flex-col md:flex flex-1">
			<div className="container flex flex-col space-y-8 py-8 sm:flex-row sm:space-y-0 md:h-16 flex-1">
				<div className="flex flex-col gap-12 w-full">
					<div className="flex text-center flex-col gap-4">
						<h2 className="text-3xl mb-4">Heimdall Explorer.</h2>
						<div className="flex justify-center">
							<Search />
						</div>
					</div>

					<div className="grid grid-cols-3 gap-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Guardians</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">1</div>
								{/* <p className="text-xs text-muted-foreground"></p> */}
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Protocols</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">1</div>
								{/* <p className="text-xs text-muted-foreground"></p> */}
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">0</div>
								{/* <p className="text-xs text-muted-foreground"></p> */}
							</CardContent>
						</Card>
					</div>

					<Separator />

					<KnownProtocols />
				</div>
			</div>
		</div>
	)
}
