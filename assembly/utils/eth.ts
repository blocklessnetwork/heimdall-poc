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
