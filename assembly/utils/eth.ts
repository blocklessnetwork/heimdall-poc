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

	static fromJson(data: json.JSON.Obj): RawTransaction {
		return new RawTransaction(
			data.getInteger('chainId')!._num,
			data.getInteger('nonce')!._num,
			data.getString('from')!._str,
			data.getString('to')!._str,
			data.getString('value') ? u128.from(data.getString('value')!._str) : null,
			data.getString('value')!._str
		)
	}
}
