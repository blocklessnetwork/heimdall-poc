import { ethers } from 'ethers'

export async function generateComplianceCertificate(
	txData: ethers.TransactionLike
): Promise<ethers.TransactionLike> {
	const body = JSON.stringify({
		jsonrpc: '2.0',
		method: 'hm_requestComplianceCertificate',
		params: [txData],
		id: 1
	})

	const response = await fetch(process.env.BLS_ENDPOINT!, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body
	})

	const jsonResponse = await response.json()

	// Additional validdation here ...

	return jsonResponse.result
}
