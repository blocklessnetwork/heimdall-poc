import { ComplianceCertificate, TaskResult } from '.'
import { Web3 } from '../utils/web3'
import { json } from '@blockless/sdk'
import { RawTransaction } from '../utils/eth'
import { ComplianceRequirements } from './complianceRequirements'
import { RequirementBlockOfacAssets } from './complianceRequirements/blockOfacAssets'
import { EMPTY_CERT_BYTES } from '../data/constants'

export class GenerateCertificate {
	private web3: Web3
	private tx: RawTransaction
	private isCompliant: boolean = true
	private error: string | null = null
	private certificate: ComplianceCertificate | null = null

	constructor(params: json.JSON.Value[]) {
		this.web3 = new Web3()
		this.tx = RawTransaction.fromJSON(<json.JSON.Obj>params[0])

		this.validate()
		this.generateCertificate()
	}

	/**
	 * Run validation steps to ensure a given transaction is compliant
	 *
	 * 1. Validate if the target contract is compatible with Heimdall
	 * 2. Assess whether there are compliance policies set
	 * 3. Loop through all policies and execute tasks for individual requirements in each policy
	 *
	 * @returns
	 */
	validate(): void {
		if (!this.tx) {
			this.error = 'Invalid Tx'
			return
		}

		const targetContract = this.tx.to
		const isHeimdall = this.web3.isHeimdallCompliant(targetContract)
		if (!isHeimdall) {
			this.error = 'Target contract is not compatible with Heimdall.'
			return
		}

		const policies = this.web3.getHeimdallPolicies(targetContract)
		if (!policies || policies.length === 0) {
			this.error = 'Target contract has no policies set.'
			return
		}

		for (let i = 0; i < policies.length; i++) {
			if (!this.error && this.isCompliant) {
				const policyAddress = policies[i]
				const requirements = this.web3.getHeimdallPolicyRequirements(policyAddress)

				for (let r = 0; r < requirements.length; r++) {
					if (!this.error && this.isCompliant) {
						const requirement = requirements[r]

						switch (requirement) {
							case ComplianceRequirements.BlockOfacAssets:
								const result = new RequirementBlockOfacAssets(this.tx.from).getResult()

								if (result.error) {
									this.error = '[RequirementBlockOfacAssets] Failed to validate requirement.'
									return
								} else if (result.value === false) {
									this.isCompliant = result.value
								}

								break
						}
					}
				}
			}
		}
	}

	/**
	 * Create a compliance certificate and generate a signature
	 *
	 * @returns
	 */
	generateCertificate(): void {
		if (this.error) return

		// Build certificate
		this.certificate = new ComplianceCertificate(this.isCompliant, this.tx.from, this.tx.to)

		// Add valid data hash if a certificate exists
		if (this.certificate) {
			let data = this.tx.data

			if (data.endsWith(EMPTY_CERT_BYTES)) {
				data = data.replace(EMPTY_CERT_BYTES, '')
			}

			this.tx.data = data + this.certificate!.getDataHash(this.tx.data.startsWith('0x'))
		}
	}

	/**
	 * Parse and send the task result
	 *
	 * @returns
	 */
	getResult(): TaskResult<json.JSON.Obj> {
		const result = new TaskResult<json.JSON.Obj>()

		if (this.error) {
			result.error = this.error
		} else {
			result.value = this.tx.toJSON()
		}

		return result
	}
}
