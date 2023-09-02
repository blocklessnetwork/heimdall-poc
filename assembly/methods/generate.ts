import { Web3 } from '../utils/web3'
import { json } from '@blockless/sdk'

export class GenerateTxCertificate {
	private web3: Web3

	constructor(params: json.JSON.Value[]) {
		this.web3 = new Web3()
	}

	getBlockNumber(): string {
		return this.web3.getBlock().toString()
	}

	getResult(): string {
		return this.getBlockNumber()
	}
}
