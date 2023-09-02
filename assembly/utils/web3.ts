import Env from './env'
import { http, json } from '@blockless/sdk'
import { u128 } from 'as-bignum/assembly'

/**
 * Web3 API wrapper
 *
 */
export class Web3 {
	private httpClient: http.Client

	constructor() {
		const httpClientHeaders = new Map<string, string>()
		httpClientHeaders.set('Content-Type', 'application/json')

		const httpClientOptions = new http.ClientOptions(Env.WEB3_RPC_ENDPOINT, httpClientHeaders)

		this.httpClient = new http.Client(httpClientOptions)
	}

	getBlock(): u128 {
		let value = this.rpcCall(1, 'eth_blockNumber')
		return u128.from(value)
	}

	/**
	 * Make an RPC call to the Web3 endpoint
	 *
	 * @param id
	 * @param method
	 */
	private rpcCall(id: number, method: string): string {
		if (!this.httpClient) return ''

		const request = new json.JSON.Obj()

		request.set('id', i32(id))
		request.set('jsonrpc', '2.0')
		request.set('method', method)
		request.set('params', [])

		const response = this.httpClient.post('', request.stringify())
		const result = response.getString('result')!._str

		return result
	}
}
