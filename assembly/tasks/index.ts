import Env from '../utils/env'
import { signBls } from '../utils/sigVerify'

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
	private signature: string = '0x'

	constructor(isCompliant: boolean, senderAddress: string, destAddress: string) {
		this.isCompliant = isCompliant
		this.senderAddress = senderAddress
		this.destAddress = destAddress

		this.timestamp = Date.now().toString()

		this.guardian = Env.GUARDIAN_PUBLIC_KEY
		this.signature = this.sign()
	}

	private getMessageHash(): string {
		// TODO: Create message hash for the compliance certificate
		return '0x'
	}

	sign(): string {
		const messageHash = this.getMessageHash()

		const signature = signBls(messageHash, Env.GUARDIAN_PRIVATE_KEY)

		return signature
	}

	getHash(): string {
		return '0x'
	}
}
