import { memory } from '@blockless/sdk'

export default class Env {
	static WEB3_RPC_ENDPOINT: string = ''
	static GUARDIAN_ADDRESS: string = ''
	static GUARDIAN_PUBLIC_KEY: string = ''
	static GUARDIAN_PRIVATE_KEY: string = ''

	static initalize(): void {
		const blsEnv = new memory.EnvVars().read()
		const blsEnvJson = blsEnv.toJSON()

		if (blsEnvJson.has('WEB3_RPC_ENDPOINT')) {
			this.WEB3_RPC_ENDPOINT = blsEnvJson.getString('WEB3_RPC_ENDPOINT')!.toString()
		}
		if (blsEnvJson.has('GUARDIAN_ADDRESS')) {
			this.GUARDIAN_ADDRESS = blsEnvJson.getString('GUARDIAN_ADDRESS')!.toString()
		}
		if (blsEnvJson.has('GUARDIAN_PUBLIC_KEY')) {
			this.GUARDIAN_PUBLIC_KEY = blsEnvJson.getString('GUARDIAN_PUBLIC_KEY')!.toString()
		}
		if (blsEnvJson.has('GUARDIAN_PRIVATE_KEY')) {
			this.GUARDIAN_PRIVATE_KEY = blsEnvJson.getString('GUARDIAN_PRIVATE_KEY')!.toString()
		}
	}
}
