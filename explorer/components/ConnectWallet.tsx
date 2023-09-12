'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAtom } from 'jotai/react'
import walletAtom from '@/atoms/wallet'
import { shortenString } from '@/lib/strings'

export default function ConnectWallet() {
	const [address, setAddress] = useAtom(walletAtom.address)
	const [networkRPC, setNetworkRPC] = useAtom(walletAtom.networkRPC)
	const [blsRPC, setBlsRPC] = useAtom(walletAtom.blsRPC)

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline">{address ? shortenString(address) : 'Connect Wallet'}</Button>
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
								value={networkRPC}
								readOnly
								className="col-span-2 h-8"
								onChange={(e) => setNetworkRPC(e.target.value)}
							/>
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="bls">BLS RPC</Label>
							<Input
								id="bls"
								value={blsRPC}
								readOnly
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
								onChange={(e) => {
									const value = e.target.value
									if (value) {
										setAddress(value)
									} else {
										setAddress(walletAtom.addressDefault)
									}
								}}
							/>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
