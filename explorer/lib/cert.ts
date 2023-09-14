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

	const response = await fetch(
		rpcEndpoint || (process.env.BLS_ENDPOINT || process.env.NEXT_PUBLIC_BLS_ENDPOINT)!,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body
		}
	)

	const jsonResponse = await response.json()

	// Additional validdation here ...

	return jsonResponse.result
}
