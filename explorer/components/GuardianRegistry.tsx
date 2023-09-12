import { getEthereumProvider } from '@/lib/ethers'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table'
import { ethers } from 'ethers'
import registryAbi from '@/data/registryAbis.json'
import { shortenString } from '@/lib/strings'

const GuardianRegistryAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export default async function GuardianRegistry() {
	let guardians: { address: string; publicKey: string }[] = []

	try {
		const code = await getEthereumProvider().getCode(GuardianRegistryAddress)
		if (code === '0x') return <></>

		const contract = new ethers.Contract(
			GuardianRegistryAddress,
			registryAbi.abi,
			getEthereumProvider()
		)
		const guardiansList = await contract.listGuardians()

		for (let i = 0; i < guardiansList[0].length; i++) {
			guardians.push({
				address: guardiansList[0][i],
				publicKey: shortenString(guardiansList[1][i], 16)
			})
		}
	} catch (error) {
		return <></>
	}

	return (
		<>
			<div className="flex flex-col">
				<div className="flex flex-col gap-2 mb-4">
					<h2 className="text-2xl">Guardian Registry</h2>
					<p className="opacity-75">{GuardianRegistryAddress}</p>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w w-36">Index</TableHead>
							<TableHead>Guardian Address</TableHead>
							<TableHead>Public Key</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{guardians.map((a, i: number) => (
							<TableRow key={i}>
								<TableCell>{i}</TableCell>
								<TableCell>{a.address}</TableCell>
								<TableCell>{a.publicKey}</TableCell>
								<TableCell>Active</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	)
}
