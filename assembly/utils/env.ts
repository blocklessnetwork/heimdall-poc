import { memory } from '@blockless/sdk'

export default class Env {
	static WEB3_RPC_ENDPOINT: string = ''

	static initalize(): void {
		const blsEnv = new memory.EnvVars().read()
		const blsEnvJson = blsEnv.toJSON()

		if (blsEnvJson.has('WEB3_RPC_ENDPOINT')) {
			this.WEB3_RPC_ENDPOINT = blsEnvJson.getString('WEB3_RPC_ENDPOINT')!.toString()
		}
	}
}
