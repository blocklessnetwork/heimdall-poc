import Link from 'next/link'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table'
import { knownProtocols } from '@/data/knownProtocols'

export default async function KnownProtocols() {
	let protocols = knownProtocols

	return (
		<>
			<div className="flex flex-col">
				<div className="flex flex-col gap-2 mb-4">
					<h2 className="text-2xl">Protocols</h2>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Address</TableHead>
							<TableHead>Transactions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{protocols.map((a, i: number) => (
							<TableRow key={i}>
								<TableCell>
									<Link className="block" href={`/protocol/${a.id}`}>
										{a.name}
									</Link>
								</TableCell>
								<TableCell>
									<Link className="block" href={`/protocol/${a.id}`}>
										{a.id}
									</Link>
								</TableCell>
								<TableCell>0</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	)
}
