import { http, json } from '@blockless/sdk'
import { GenerateTxCertificate } from './methods/generate'
import Env from './utils/env'

Env.initalize()

/**
 * Fetch sample JSON content and serve.
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
			const instance = new GenerateTxCertificate(params)

			body.set('id', reqBody.getInteger('id'))
			body.set('result', instance.getResult())
		} else {
			body.set('error', 'Invalid Request.')
		}
	} else {
		body.set('error', 'Invalid Request.')
	}

	return new http.Response(body.stringify()).header('Content-Type', 'application/json').status(200)
})
