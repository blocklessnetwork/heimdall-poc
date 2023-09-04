import { json } from '@blockless/sdk'
import Env from '../utils/env'
import { signBls } from '../utils/sigVerify'
import { abiEncodePacked } from '../utils/eth'

export class TaskResult<T> {
	value: T | null = null
	error: string | null = null
}

export class ComplianceCertificate {
	private isCompliant: boolean = false

	private senderAddress: string
	private destAddress: string
	private timestamp: string

	private guardian: string
	private signature: string = ''

	constructor(isCompliant: boolean, senderAddress: string, destAddress: string) {
		this.isCompliant = isCompliant
		this.senderAddress = senderAddress
		this.destAddress = destAddress

		this.timestamp = Date.now().toString()

		this.guardian = Env.GUARDIAN_PUBLIC_KEY
		this.signature = this.sign()
	}

	private getMessageHash(): string {
		const values: json.JSON.Value[] = []
		values.push(json.JSON.from(this.isCompliant))
		values.push(json.JSON.from(this.senderAddress))
		values.push(json.JSON.from(this.destAddress))
		values.push(json.JSON.from(this.timestamp))

		return `0x${abiEncodePacked(values)}`
	}

	sign(): string {
		const messageHash = this.getMessageHash()

		const signature = signBls(messageHash, Env.GUARDIAN_PRIVATE_KEY)

		return signature
	}

	getDataHash(): string {
		const values: json.JSON.Value[] = []
		values.push(json.JSON.from(this.isCompliant))
		values.push(json.JSON.from(this.senderAddress))
		values.push(json.JSON.from(this.destAddress))
		values.push(json.JSON.from(this.timestamp))
		values.push(json.JSON.from(this.guardian))
		values.push(json.JSON.from(this.signature))

		return `0x${abiEncodePacked(values)}`
	}
}
