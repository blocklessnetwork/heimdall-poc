import { json } from '@blockless/sdk'
import { u128 } from 'as-bignum/assembly'

export type Address = string
export type BigInt = u128
export type Bytes = string

export class RawTransaction {
	constructor(
		public chainId: i64,
		public nonce: i64,
		public from: Address,
		public to: Address,
		public value: BigInt | null,
		public data: Bytes
	) {}

	static fromJSON(data: json.JSON.Obj): RawTransaction {
		// Tx Validation

		return new RawTransaction(
			data.getInteger('chainId')!._num,
			data.getInteger('nonce')!._num,
			data.getString('from')!._str,
			data.getString('to')!._str,
			data.getString('value') ? u128.from(data.getString('value')!._str) : null,
			data.getString('value')!._str
		)
	}

	toJSON(): json.JSON.Obj {
		const response = new json.JSON.Obj()
		response.set('chainId', this.chainId)
		response.set('nonce', this.nonce)
		response.set('from', this.from)
		response.set('to', this.to)
		response.set('value', this.value ? this.value!.toString() : '')
		response.set('data', this.data)
		return response
	}
}

export function abiEncodePacked(args: json.JSON.Value[]): string {
	let encodedData = ''

	function toHex(value: string): string {
		let hex = ''
		for (let i = 0; i < value.length; i++) {
			hex += value.charCodeAt(i).toString(16).padStart(2, '0')
		}
		return hex
	}

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]

		if (arg.isString) {
			const hexString = toHex((arg as json.JSON.Str)._str)
			const length = hexString.length / 2
			// encodedData +=  // Encode length as a hexadecimal byte
			encodedData += (length.toString(16) + hexString).padStart(64, '0')
		} else if (arg.isNum || arg.isInteger) {
			const hexValue = (arg as json.JSON.Integer)._num.toString(16).padStart(64, '0')
			encodedData += hexValue
		} else if (arg.isBool) {
			const hexValue = arg ? '01' : '00'
			encodedData += hexValue.padStart(64, '0')
		} else {
			throw new Error(`Unsupported type: ${typeof arg}`)
		}
	}

	return encodedData
}
