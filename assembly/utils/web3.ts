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

	/**
	 * Get the latest block number
	 *
	 * @returns
	 */
	getBlock(): u128 {
		let value = this.rpcCall(1, 'eth_blockNumber')
		return u128.from(value)
	}

	/**
	 * Check if a contract is Heimdall compliant
	 *
	 * @param contract
	 * @returns
	 */
	isHeimdallCompliant(contract: string): bool {
		if (!this.httpClient) return false

		const request = new json.JSON.Obj()

		request.set('id', i32(1))
		request.set('jsonrpc', '2.0')
		request.set('method', 'eth_call')
		request.set('params', [{ data: '0x40bd1b7e', to: contract }])

		const data = new http.Client().post(``, request.stringify())
		const result = data.getString('result')!._str

		return result === 'true'
	}

	/**
	 * Fetch heimdall compliance policies for a given contract
	 *
	 * @param contract
	 * @returns
	 */
	getHeimdallPolicies(contract: string): string[] {
		if (!this.httpClient) return []

		const request = new json.JSON.Obj()

		request.set('id', i32(1))
		request.set('jsonrpc', '2.0')
		request.set('method', 'eth_call')
		request.set('params', [{ data: '0x3b04f6f1', to: contract }])

		const data = new http.Client().post(``, request.stringify())
		const result = data.getString('result')!._str
		// TODO Parse response

		return []
	}

	/**
	 * Fetch heimdall compliance policy requirements
	 *
	 * @param contract
	 * @returns
	 */
	getHeimdallPolicyRequirements(contract: string): u8[] {
		if (!this.httpClient) return []

		const request = new json.JSON.Obj()

		request.set('id', i32(1))
		request.set('jsonrpc', '2.0')
		request.set('method', 'eth_call')
		request.set('params', [{ data: '0x7ae42ff9', to: contract }])

		const data = new http.Client().post(``, request.stringify())
		const result = data.getString('result')!._str
		// TODO Parse response

		return []
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
