import { TaskResult } from '.'
import { Web3 } from '../utils/web3'
import { json } from '@blockless/sdk'

export class GenerateTxCertificate {
	private web3: Web3

	constructor(params: json.JSON.Value[]) {
		this.web3 = new Web3()

		// Validation
		this._validate()
	}

	private _validate(): boolean {
		return false
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
		
		const resultValue = new json.JSON.Obj()
		resultValue.set('blockNumber', this.getBlockNumber())

		result.value = resultValue

		return result
	}
}
