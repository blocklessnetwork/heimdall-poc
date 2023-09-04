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

		let isCompliant = false

		const request = new json.JSON.Obj()
		const params = new json.JSON.Obj()
		const paramsList = new json.JSON.Arr()

		params.set('data', '0x40bd1b7e')
		params.set('to', contract)

		paramsList.push(params)
		paramsList.push(json.JSON.from('latest'))

		request.set('id', i32(2))
		request.set('jsonrpc', '2.0')
		request.set('method', 'eth_call')
		request.set('params', paramsList)

		const response = this.httpClient.post('', request.stringify())
		const result = response.getString('result')

		if (result) {
			let pos = 2
			isCompliant = u128.fromString(result._str.slice(pos, (pos += 64)), 16) === u128.from(1)
		}

		return isCompliant
	}

	/**
	 * Fetch heimdall compliance policies for a given contract
	 *
	 * @param contract
	 * @returns
	 */
	getHeimdallPolicies(contract: string): string[] {
		if (!this.httpClient) return []

		let policies: string[] = []

		const request = new json.JSON.Obj()
		const params = new json.JSON.Obj()
		const paramsList = new json.JSON.Arr()

		params.set('data', '0x3b04f6f1')
		params.set('to', contract)

		paramsList.push(params)
		paramsList.push(json.JSON.from('latest'))

		request.set('id', i32(1))
		request.set('jsonrpc', '2.0')
		request.set('method', 'eth_call')
		request.set('params', paramsList)

		const data = this.httpClient.post(``, request.stringify())
		const result = data.getString('result')

		if (result) {
			let pos = 2
			const _ = u128.fromString(result._str.slice(pos, (pos += 64)), 16)
			const noItems = u128.fromString(result._str.slice(pos, (pos += 64)), 16)

			for (let i = 0; i < noItems.toI32(); i++) {
				const address = `0x${result._str.slice(pos, (pos += 64)).slice(-40)}`
				policies.push(address.toString())
			}
		}

		return policies
	}

	/**
	 * Fetch heimdall compliance policy requirements
	 *
	 * @param contract
	 * @returns
	 */
	getHeimdallPolicyRequirements(contract: string): i32[] {
		if (!this.httpClient) return []

		let requirements: i32[] = []

		const request = new json.JSON.Obj()
		const params = new json.JSON.Obj()
		const paramsList = new json.JSON.Arr()

		params.set('data', '0x7ae42ff9')
		params.set('to', contract)

		paramsList.push(params)
		paramsList.push(json.JSON.from('latest'))

		request.set('id', i32(1))
		request.set('jsonrpc', '2.0')
		request.set('method', 'eth_call')
		request.set('params', paramsList)

		const data = this.httpClient.post(``, request.stringify())
		const result = data.getString('result')

		if (result) {
			let pos = 2
			const _ = u128.fromString(result._str.slice(pos, (pos += 64)), 16)
			const noItems = u128.fromString(result._str.slice(pos, (pos += 64)), 16)

			for (let i = 0; i < noItems.toI32(); i++) {
				const id = u128.fromString(result._str.slice(pos, (pos += 64)), 16)
				requirements.push(id.toI32())
			}
		}

		return requirements
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
