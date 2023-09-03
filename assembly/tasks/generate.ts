import { TaskResult } from '.'
import { Web3 } from '../utils/web3'
import { json } from '@blockless/sdk'
import { RawTransaction } from '../utils/eth'

export class ComplianceCertificate {
	private compliant: boolean = false
}

export class GenerateCertificate {
	private web3: Web3
	private tx: RawTransaction

	constructor(params: json.JSON.Value[]) {
		this.web3 = new Web3()
		this.tx = RawTransaction.fromJSON(<json.JSON.Obj>params[0])
	}

	getBlockNumber(): string {
		return this.web3.getBlock().toString()
	}

	/**
	 * Parse and send the task result
	 *
	 * @returns
	 */
	getResult(): TaskResult<json.JSON.Obj> {
		const result = new TaskResult<json.JSON.Obj>()

		result.value = this.tx.toJSON()

		return result
	}
}
