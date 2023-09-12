import { notFound } from 'next/navigation'
import { FunctionFragment, ethers } from 'ethers'
import { getEthereumProvider } from '@/lib/ethers'

import { abi as policyAbi } from '@/data/policyAbis.json'
import { abi as protocolAbi } from '@/data/protocolAbis.json'
import { Separator } from '@/components/ui/separator'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import Link from 'next/link'
import { getKnownProtocol } from '@/data/knownProtocols'
import TransactionEmulator from '@/components/TransactionEmulator'

export default async function ProtocolDetail({ params }: { params: { id: string } }) {
	let name: string | null
	let registry: string
	let creator: string
	let policies: { address: string; name: string }[] = []
	let compatibleFunctions: FunctionFragment[] = []

	try {
		const code = await getEthereumProvider().getCode(params.id)
		if (code === '0x') notFound()

		const protocol = getKnownProtocol(params.id)

		const contract = new ethers.Contract(
			params.id,
			protocol ? protocol.abi : protocolAbi,
			getEthereumProvider()
		)

		contract.interface.fragments.map((f) => {
			if (f.inputs.length > 1 && f.inputs[f.inputs.length - 1].name === 'certificate') {
				compatibleFunctions.push(f as FunctionFragment)
			}
		})

		registry = await contract.guardianRegistry()

		name = protocol ? protocol.name : null
		creator = await contract.owner()
		const policyAddresses = await contract.getPolicies()

		for (const address of policyAddresses) {
			try {
				const policyContract = new ethers.Contract(address, policyAbi, getEthereumProvider())
				policies.push({ address, name: await policyContract.name() })
			} catch {}
		}
	} catch (error) {
		notFound()
	}

	return (
		<>
			<div className="h-full flex-1 flex-col md:flex">
				<div className="container flex flex-1 flex-col items-start space-y-2 py-4 md:h-16">
					<div className="mb-4">
						<h2 className="text-2xl mb-1">Protcol</h2>
						<p className="opacity-75">{params.id}</p>
					</div>
					<div className="w-full flex gap-8">
						<div className="flex flex-col gap-8 w-3/4">
							<Separator />
							<div className="flex flex-col gap-4">
								<h3 className="text-xl mb-1">Details</h3>
								{name && (
									<div className="flex gap-4">
										<label className="w-24 font-semibold">Name</label>
										<span>{name}</span>
									</div>
								)}
								<div className="flex gap-4">
									<label className="w-24 font-semibold">Creator</label>
									<span>{creator}</span>
								</div>
								<div className="flex gap-4">
									<label className="w-24 font-semibold">Registry</label>
									<span>{registry}</span>
								</div>
							</div>
							<div className="flex flex-col gap-4">
								<h3 className="text-xl mb-1">Policies</h3>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w w-36">Index</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Address</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{policies.map((p, i: number) => (
											<TableRow key={i}>
												<TableCell>{i}</TableCell>
												<TableCell>{<Link href={`/policy/${p.address}`}>{p.name}</Link>}</TableCell>
												<TableCell>
													{<Link href={`/policy/${p.address}`}>{p.address}</Link>}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>
						<div className="flex flex-col gap-8 w-1/4">
							<Separator />
							<TransactionEmulator
								contractAddress={params.id}
								compatibleFunctions={JSON.parse(JSON.stringify(compatibleFunctions))}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
