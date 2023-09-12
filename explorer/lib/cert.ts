import { ethers } from 'ethers'

export async function generateComplianceCertificate(
	txData: ethers.TransactionLike,
	rpcEndpoint?: string
): Promise<ethers.TransactionLike> {
	const body = JSON.stringify({
		jsonrpc: '2.0',
		method: 'hm_requestComplianceCertificate',
		params: [txData],
		id: 1
	})

	const response = await fetch(rpcEndpoint || 'http://127.0.0.1:3000', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body
	})

	const jsonResponse = await response.json()

	// Additional validdation here ...

	return jsonResponse.result
}
