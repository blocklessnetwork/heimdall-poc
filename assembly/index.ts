import Env from './utils/env'
import { http, json } from '@blockless/sdk'
import { GenerateCertificate } from './tasks/generate'

// Initialize and load environment variables in memory
Env.initalize()

/**
 * Create and serve the RPC JSON endpoint.
 *
 */
http.HttpComponent.serve((req: http.Request) => {
	const method = req.method
	const body = new json.JSON.Obj()

	if (method === 'POST' && req.body) {
		let reqBody: json.JSON.Obj = <json.JSON.Obj>json.JSON.parse(decodeURIComponent(req.body!))

		if (
			(reqBody.has('method') &&
				reqBody.getString('method')!._str === 'hm_requestComplianceCertificate' &&
				reqBody.has('jsonrpc') &&
				reqBody.getString('jsonrpc')!._str === '2.0',
			reqBody.has('params'))
		) {
			const params = reqBody.getArr('params')!._arr
			const task = new GenerateCertificate(params)
			const result = task.getResult()

			if (result.error === null && result.value !== null) {
				body.set('id', reqBody.getInteger('id'))
				body.set('result', result.value)
			} else {
				body.set('id', reqBody.getInteger('id'))
				body.set('error', result.error || 'Something went wrong.')
			}
		} else {
			body.set('error', 'Invalid Request.')
		}
	} else {
		body.set('error', 'Invalid Request.')
	}

	return new http.Response(body.stringify()).header('Content-Type', 'application/json').status(200)
})
