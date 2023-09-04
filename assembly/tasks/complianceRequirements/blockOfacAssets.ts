import { http } from '@blockless/sdk'
import { ComplianceRequirementTaskResult } from '.'

// Source File
const SANCTIONED_ADDRESSES = 'bafkreifu2cna6tlzebhg2rtw6pvzvn7u6pctg55a6nn2o6mq2tyeqxnahe'

/**
 * Compliance requirement task to check for Blocked Ofac Assets
 *
 */
export class RequirementBlockOfacAssets {
	private isCompliant: boolean

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
	getResult(): ComplianceRequirementTaskResult {
		const result = new ComplianceRequirementTaskResult()

		if (this.isCompliant === true || this.isCompliant === false) {
			result.value = this.isCompliant
		} else {
			result.error = 'Unable to validate Blocked Ofac Assets'
		}

		return result
	}
}
