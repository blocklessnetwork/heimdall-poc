import { ethers } from 'ethers'

let provider: ethers.JsonRpcProvider | undefined

export function getEthereumProvider(providerUrl?: string): ethers.JsonRpcProvider {
	if (!provider) {
		provider = new ethers.JsonRpcProvider(providerUrl)
	}

	return provider
}

getEthereumProvider(process.env.RPC_ENDPOINT || process.env.NEXT_PUBLIC_RPC_ENDPOINT)

export function isValidEthereumAddress(address: string): boolean {
	try {
		const addressBytes = ethers.getAddress(address)
		return addressBytes.toString().toLowerCase() === address.toLowerCase()
	} catch (error) {
		return false // Invalid Ethereum address
	}
}
