import { json, http } from '@blockless/sdk'
import { TaskResult } from '..'

// Source File
const SANCTIONED_ADDRESSES = 'bafkreifu2cna6tlzebhg2rtw6pvzvn7u6pctg55a6nn2o6mq2tyeqxnahe'

/**
 * Compliance requirement task to check for Blocked Ofac Assets
 * 
 */
export class RequirementBlockOfacAssets {
	private isCompliant: bool | null = null

	constructor(address: string) {
		const response = new http.Client().get(`https://dweb.link/api/v0/cat/${SANCTIONED_ADDRESSES}`)
		const sanctionedAddresses = response.getArr('addresses')!._arr

		let isFound = false
		for (let i = 0; i < sanctionedAddresses.length; i++) {
			const sanctionedAddress = sanctionedAddresses[i]

			if (address === sanctionedAddress.stringify()) {
				isFound = true
			}
		}

		this.isCompliant = !isFound
	}

	/**
	 * Parse and send the task result
	 *
	 * @returns
	 */
	getResult(): TaskResult<json.JSON.Obj> {
		const result = new TaskResult<json.JSON.Obj>()

		if (this.isCompliant !== null) {
			const response = new json.JSON.Obj()
			response.set('isCompliant', this.isCompliant)
			result.value = response
		} else {
			result.error = 'Unable to validate Blocked Ofac Assets'
		}

		return result
	}
}
