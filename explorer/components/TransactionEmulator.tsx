'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from './ui/dialog'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { CheckCircle, Hourglass, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { FunctionFragment, ethers } from 'ethers'
import { getKnownProtocol } from '@/data/knownProtocols'
import { abi as protocolAbi } from '@/data/protocolAbis.json'
import { getEthereumProvider } from '@/lib/ethers'
import { EMPTY_CERT } from '@/data/constants'
import { useAtomValue } from 'jotai/react'
import walletAtom from '@/atoms/wallet'
import { generateComplianceCertificate } from '@/lib/cert'
import JsonView from '@uiw/react-json-view'

const defaultSteps: { status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'; label: string }[] = [
	{
		status: 'COMPLETED',
		label: 'Prepare Transaction'
	},
	{
		status: 'PENDING',
		label: 'Generate Certificate on Blockless'
	}
]

export default function TransactionEmulator({
	contractAddress,
	compatibleFunctions
}: {
	contractAddress: string
	compatibleFunctions: FunctionFragment[]
}) {
	const [selectedFn, setSelectedFn] = useState<string | undefined>(undefined)
	const [inputValues, setInputValues] = useState<(string | null)[]>([])
	const [isValid, setIsValid] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [progress, setProgress] = useState(JSON.parse(JSON.stringify(defaultSteps)))

	const fromAddress = useAtomValue(walletAtom.address)
	const blsRPC = useAtomValue(walletAtom.blsRPC)
	const [requestData, setRequestData] = useState({})
	const [responseData, setResponseData] = useState({})
	const [certificateData, setCertificateData] = useState({})
	const selectedFunction = compatibleFunctions.find((cf) => cf.name === selectedFn)

	// Initalize provider and contract
	const provider = getEthereumProvider()
	const protocol = getKnownProtocol(contractAddress)
	const contract = new ethers.Contract(
		contractAddress,
		protocol ? protocol.abi : protocolAbi,
		provider
	)

	// Reset handler for a new transaction
	const handleReset = () => {
		setIsLoading(false)
		setProgress(JSON.parse(JSON.stringify(defaultSteps)))
		setCertificateData({})
		setRequestData({})
		setResponseData({})
	}

	// Update state values on input change
	const handleInputChange = (index: number, newValue: string) => {
		const newInputValues = [...inputValues]

		newInputValues[index] = newValue

		setInputValues(newInputValues)
		setIsValid(newInputValues.filter((v) => !!v).length === 3)
	}

	// Generate a new certificate and update request / response data
	const handleGenerateCertificate = async () => {
		setIsLoading(true)

		const newProgress = [...progress]
		newProgress[0].status = 'COMPLETED'
		newProgress[1].status = 'IN_PROGRESS'
		setProgress(newProgress)

		// Generate raw transaction data with an empty certificate
		const txData: ethers.TransactionLike = {
			chainId: Number((await provider.getNetwork()).chainId),
			type: 2,
			nonce: 1,
			value: ethers.parseEther('0').toString(),
			from: fromAddress,
			...(await contract
				.getFunction(selectedFn as string)
				.populateTransaction(ethers.ZeroAddress, ethers.ZeroAddress, 1 * 1e8, EMPTY_CERT))
		}

		// Send raw transaction data for compliance check
		const txDataWithCertificate = await generateComplianceCertificate(txData, blsRPC)

		// Decode the response and extract the certificate
		const certificateData = contract.interface
			.decodeFunctionData(selectedFn as string, txDataWithCertificate.data!)
			.certificate.toObject()

		// Update request, response and certificate data for display
		setRequestData(txData)
		setResponseData(txDataWithCertificate)
		setCertificateData(certificateData)

		const newProgress2 = [...progress]
		newProgress2[1].status = 'COMPLETED'
		setProgress(newProgress2)
		setIsLoading(false)
	}

	return (
		<>
			<div className="flex flex-col gap-4">
				<h3 className="text-xl mb-1">Transaction Emulator</h3>

				<div className="flex flex-col gap-2">
					<span className="text-md">Method</span>
					<Select value={selectedFn} onValueChange={(v) => setSelectedFn(v)}>
						<SelectTrigger>
							<SelectValue placeholder="Select function ..." />
						</SelectTrigger>
						<SelectContent>
							{compatibleFunctions.map((cf, i) => (
								<SelectItem key={i} value={cf.name} defaultChecked={true}>
									{cf.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{selectedFunction && (
					<>
						{selectedFunction.inputs
							.filter((input) => input.name !== 'certificate')
							.map((input, i) => (
								<div key={i} className="flex flex-col gap-2">
									<span className="text-md">{input.name}</span>
									<Input
										value={inputValues[i] || ''}
										pattern={input.type.indexOf('int') !== -1 ? '[0-9]+' : ''}
										className="col-span-2"
										placeholder={`Enter ${input.type} ...`}
										onChange={(e) => handleInputChange(i, e.target.value)}
									/>
								</div>
							))}
					</>
				)}

				<Dialog>
					<DialogTrigger asChild disabled={!isValid}>
						<Button className="w-full" disabled={!isValid} onClick={() => handleReset()}>
							Start
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Transaction Emulator</DialogTitle>
							<DialogDescription>
								This action emulates the Heimdall's compliance certification generation and
								verification.
							</DialogDescription>
						</DialogHeader>
						<div className="my-6 space-y-6">
							{progress &&
								progress.map((s: any, i: number) => (
									<div className="relative" key={i}>
										<div className="flex items-center">
											<div className="w-6 h-6 flex items-center justify-center">
												{s.status === 'IN_PROGRESS' && <Loader2 className="h-6 w-6 animate-spin" />}
												{s.status === 'COMPLETED' && <CheckCircle />}
												{s.status === 'PENDING' && <Hourglass />}
											</div>
											<div className="ml-4 font-semibold">{s.label}</div>
										</div>
									</div>
								))}
							<div>
								{progress &&
									progress.length > 0 &&
									progress[progress.length - 1].status === 'COMPLETED' && (
										<Tabs defaultValue="certificate">
											<TabsList className="grid w-full grid-cols-3">
												<TabsTrigger value="certificate">Certificate</TabsTrigger>
												<TabsTrigger value="response">Response</TabsTrigger>
												<TabsTrigger value="request">Request</TabsTrigger>
											</TabsList>
											<TabsContent value="certificate">
												<div className="w-[450px] max-w-[450px] overflow-auto">
													<JsonView
														value={certificateData}
														enableClipboard={false}
														shortenTextAfterLength={0}
													/>
												</div>
											</TabsContent>
											<TabsContent value="response">
												<div className="w-[450px] max-w-[450px] overflow-auto">
													<JsonView
														value={responseData}
														enableClipboard={false}
														shortenTextAfterLength={0}
													/>
												</div>
											</TabsContent>
											<TabsContent value="request">
												<div className="w-[450px] max-w-[450px] overflow-auto">
													<JsonView
														value={requestData}
														enableClipboard={false}
														shortenTextAfterLength={0}
													/>
												</div>
											</TabsContent>
										</Tabs>
									)}
							</div>
						</div>
						{!(
							progress &&
							progress.length > 0 &&
							progress[progress.length - 1].status === 'COMPLETED'
						) && (
							<DialogFooter>
								<Button className="w-full" onClick={() => handleGenerateCertificate()}>
									{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Generate Certificate
								</Button>
							</DialogFooter>
						)}
					</DialogContent>
				</Dialog>
			</div>
		</>
	)
}
