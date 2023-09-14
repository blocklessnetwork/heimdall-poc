import { notFound } from 'next/navigation'
import { ethers } from 'ethers'
import { getEthereumProvider } from '@/lib/ethers'

import policyAbis from '@/data/policyAbis.json'
import { Separator } from '@/components/ui/separator'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { getPolicyRequirementData } from '@/data/policyRequirements'

export default async function PolicyDetail({ params }: { params: { id: string } }) {
	let name: string
	let version: string
	let requirements: number[]

	try {
		const code = await getEthereumProvider().getCode(params.id)
		if (code === '0x') notFound()

		const contract = new ethers.Contract(params.id, policyAbis.abi, getEthereumProvider())

		name = await contract.name()
		version = await contract.version()
		requirements = await contract.getRequirements()
	} catch (error) {
		notFound()
	}

	return (
		<>
			<div className="h-full flex-1 flex-col md:flex">
				<div className="container flex flex-1 flex-col items-start space-y-2 py-4 md:h-16">
					<div className="mb-4">
						<h2 className="text-2xl mb-1">Compliance Policy</h2>
						<p className="opacity-75">{params.id}</p>
					</div>
					<div className="flex flex-col gap-8 w-3/4">
						<Separator />
						<div className="flex flex-col gap-4">
							<h3 className="text-xl mb-1">Details</h3>
							<div className="flex gap-4">
								<label className="w-24 font-semibold">Name</label>
								<span>{name}</span>
							</div>
							<div className="flex gap-4">
								<label className="w-24 font-semibold">Version</label>
								<span>{version}</span>
							</div>
						</div>
						<div className="flex flex-col gap-4">
							<h3 className="text-xl mb-1">Compliance Requirements</h3>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w w-36">Index</TableHead>
										<TableHead>Requirement</TableHead>
										<TableHead>Description</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{requirements.map((a, i: number) => (
										<TableRow key={i}>
											<TableCell>{i}</TableCell>
											<TableCell>{getPolicyRequirementData(Number(a))?.name}</TableCell>
											<TableCell>{getPolicyRequirementData(Number(a))?.descrption}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
