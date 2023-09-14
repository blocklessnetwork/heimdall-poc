'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAtom, useAtomValue } from 'jotai/react'
import walletAtom from '@/atoms/wallet'
import { shortenString } from '@/lib/strings'
import { useEffect, useState } from 'react'

export default function ConnectWallet() {
	const [walletAddress, setWalletAddress] = useAtom(walletAtom.address)
	const [walletBlsRPC, setWalletBlsRPC] = useAtom(walletAtom.blsRPC)
	const networkRPC = useAtomValue(walletAtom.networkRPC)
	const [address, setAddress] = useState(walletAddress)
	const [blsRPC, setBlsRPC] = useState(walletBlsRPC)
	const [isDirty, setIsDirty] = useState(false)
	const [isValid, setIsValid] = useState(false)

	useEffect(() => {
		if (!(address === walletAddress && blsRPC === walletBlsRPC)) {
			setIsDirty(true)
		}

		if (address.length > 0 && blsRPC.length > 0) {
			setIsValid(true)
		} else {
			setIsValid(false)
		}
	}, [address, blsRPC])

	useEffect(() => {
		setAddress(walletAddress)
		setBlsRPC(walletBlsRPC)
	}, [walletAddress, walletBlsRPC])

	const handleSave = () => {
		if (!isValid) return

		setIsDirty(false)
		setWalletAddress(address.trim())
		setWalletBlsRPC(blsRPC.trim())
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="w-[180px]" variant="outline">
					{walletAddress ? shortenString(walletAddress, 6) : 'Connect Wallet'}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Connect Wallet</h4>
						<p className="text-sm text-muted-foreground">
							Set the network RPC and wallet address to emulate.
						</p>
					</div>
					<div className="grid gap-4">
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="network">EVM RPC</Label>
							<Input
								id="network"
								defaultValue={networkRPC}
								readOnly
								disabled
								className="col-span-2 h-8"
							/>
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="bls">BLS RPC</Label>
							<Input
								id="bls"
								value={blsRPC}
								className="col-span-2 h-8"
								onChange={(e) => setBlsRPC(e.target.value)}
							/>
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="address">Address</Label>
							<Input
								id="address"
								value={address}
								className="col-span-2 h-8"
								onChange={(e) => setAddress(e.target.value)}
							/>
						</div>
						<div className="w-full">
							<Button className="w-full" disabled={!isDirty || !isValid} onClick={handleSave}>
								Save
							</Button>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
