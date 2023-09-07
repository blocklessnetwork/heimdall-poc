import { ethers } from 'ethers'

let provider: ethers.JsonRpcProvider | undefined

export function getEthereumProvider(providerUrl?: string): ethers.JsonRpcProvider {
	if (!provider) {
		provider = new ethers.JsonRpcProvider(providerUrl)
	}

	return provider
}

getEthereumProvider('http://127.0.0.1:8545')

export function isValidEthereumAddress(address: string): boolean {
	try {
		const addressBytes = ethers.getAddress(address)
		console.log('address bytes', addressBytes)
		return addressBytes.toString().toLowerCase() === address.toLowerCase()
	} catch (error) {
		return false // Invalid Ethereum address
	}
}
