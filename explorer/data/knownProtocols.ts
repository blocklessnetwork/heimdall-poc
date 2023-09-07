import { abi as sampleSwapAbi } from './sampleSwap.json'

export const knownProtocols = [
	{ id: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', name: 'Sample Swap', abi: sampleSwapAbi }
]

export function getKnownProtocol(id: string) {
	return knownProtocols.find((p) => p.id === id)
}
