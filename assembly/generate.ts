import { json } from '@blockless/sdk'
import { Web3 } from './utils/web3'

export function generateComplianceCertificate(params: json.JSON.Value[]): json.JSON.Obj {
	const result = new json.JSON.Obj()

	const web3 = new Web3()
	const blockNumber = web3.getBlock().toString()

	result.set('block_number', blockNumber)
	return result
}
