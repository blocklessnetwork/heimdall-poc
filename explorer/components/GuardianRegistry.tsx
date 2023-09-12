import { getEthereumProvider } from '@/lib/ethers'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table'
import { shortenString } from '@/lib/strings'

export default async function GuardianRegistry() {
	const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

	try {
		const code = await getEthereumProvider().getCode(address)
		if (code === '0x') return <></>
	} catch (error) {
		return <></>
	}

	const guardians = [
		{
			address: '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
			publicKey: shortenString(
				'0xa462d6f5bc4270b2cfc3b4692b8aeb61bae2db8c1e62e7eb5c47cbe7ddb6abc7505672856e99936e9c7eaebf52ae175c',
				16
			)
		}
	]

	return (
		<>
			<div className="flex flex-col">
				<div className="flex flex-col gap-2 mb-4">
					<h2 className="text-2xl">Guardian Registry</h2>
					<p className="opacity-75">{address}</p>
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
