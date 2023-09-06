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
			data.getString('data')!._str
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

export function abiEncode(types: string[], values: json.JSON.Value[]): string {
	if (types.length !== values.length) return ''

	let encodedData = ''

	for (let i = 0; i < values.length; i++) {
		const type = types[i]
		const value = values[i]

		if (type === 'address') {
			encodedData += (value as json.JSON.Str)._str.slice(2).padStart(64, '0')
		} else if (type.startsWith('uint') || type.startsWith('int')) {
			encodedData += u128
				.from((value as json.JSON.Integer)._num)
				.toString(16)
				.padStart(64, '0')
		} else if (type === 'bool') {
			encodedData += ((value as json.JSON.Bool)._bool ? '01' : '00').padStart(64, '0')
		} else if (type.startsWith('bytes')) {
			const length = (value as json.JSON.Str)._str.length / 2
			const typeHex = (value as json.JSON.Str)._str.length.toString(16).padStart(64, '0')
			const lengthHex = length.toString(16).padStart(64, '0')
			encodedData += typeHex + lengthHex + (value as json.JSON.Str)._str.padEnd(64, '0')
		} else {
			encodedData += ''
		}
	}

	return encodedData
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
			const strVal = (arg as json.JSON.Str)._str
			if (strVal.startsWith('0x')) {
				encodedData += strVal.replace('0x', '')
			} else {
				const hexString = toHex((arg as json.JSON.Str)._str)
				encodedData += hexString.padStart(64, '0')
			}
		} else if (arg.isInteger) {
			const hexValue = (arg as json.JSON.Integer)._num.toString(16).padStart(16, '0')
			encodedData += hexValue
		} else if (arg.isBool) {
			const hexValue = arg ? '01' : '00'
			encodedData += hexValue
		}
	}

	return encodedData
}
