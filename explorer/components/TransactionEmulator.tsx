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
import { Textarea } from './ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { FunctionFragment } from 'ethers'

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

// TODO: Remove - Used for video demo
const sampleRequest = {
	jsonrpc: '2.0',
	method: 'hm_requestComplianceCertificate',
	params: [
		{
			chainId: 31337,
			type: 2,
			nonce: 6,
			value: '0',
			from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
			data: ''
		}
	],
	id: 1
}

// TODO: Remove - Used for video demo
const sampleResponse = {
	id: 1,
	result: {
		chainId: 31337,
		nonce: 6,
		from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
		to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
		value: '0',
		data: '0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f39Fd6e51aad88F6F4ce6aB8827279cffFb922660000000000000000000000009fE46736679d2D9a65F0992F2272dE9f3c7fa6e00000000000000000000000000000000000000000000000000000000064f8a8a1000000000000000000000000f39Fd6e51aad88F6F4ce6aB8827279cffFb9226600000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000060894d3967e80f414870fab0214a15a06b112da07a96f79e1e8f596008fbdea889c86efcb1fcaf2e6fad7e8e774452acb707c8e64a54287ce83ecb8b667fff7d1945c8154acfc770bb3e39d72ef1cca5de6ca0c313dc62f8167cbe6ecc885424a6'
	}
}

export default function TransactionEmulator({
	compatibleFunctions
}: {
	compatibleFunctions: FunctionFragment[]
}) {
	const [selectedFn, setSelectedFn] = useState<string | undefined>(undefined)
	const [inputValues, setInputValues] = useState<(string | null)[]>([])
	const [isValid, setIsValid] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [progress, setProgress] = useState(JSON.parse(JSON.stringify(defaultSteps)))

	const selectedFunction = compatibleFunctions.find((cf) => cf.name === selectedFn)
	
	const handleInputChange = (index: number, newValue: string) => {
		const newInputValues = [...inputValues]

		newInputValues[index] = newValue

		setInputValues(newInputValues)
		setIsValid(newInputValues.filter((v) => !!v).length === 3)
	}

	const handleResetSteps = () => {
		setIsLoading(false)
		setProgress(JSON.parse(JSON.stringify(defaultSteps)))
	}

	const handleGenerateCertificate = async () => {
		setIsLoading(true)

		const newProgress = [...progress]
		newProgress[0].status = 'COMPLETED'
		newProgress[1].status = 'IN_PROGRESS'
		setProgress(newProgress)

		setTimeout(() => {
			const newProgress2 = [...progress]
			newProgress2[1].status = 'COMPLETED'
			setProgress(newProgress2)
			setIsLoading(false)
		}, 2000)
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
							{compatibleFunctions.map((cf) => (
								<SelectItem value={cf.name} defaultChecked={true}>
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
								<div className="flex flex-col gap-2">
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
						<Button className="w-full" disabled={!isValid} onClick={() => handleResetSteps()}>
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
										<Tabs defaultValue="response">
											<TabsList className="grid w-full grid-cols-2">
												<TabsTrigger value="response">Response</TabsTrigger>
												<TabsTrigger value="request">Request</TabsTrigger>
											</TabsList>
											<TabsContent value="response">
												<Textarea
													defaultValue={JSON.stringify(sampleResponse, null, 2)}
													className="h-72"
												/>
											</TabsContent>
											<TabsContent value="request">
												<Textarea
													defaultValue={JSON.stringify(sampleRequest, null, 2)}
													className="h-72"
												/>
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
