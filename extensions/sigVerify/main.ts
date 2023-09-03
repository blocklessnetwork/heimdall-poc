import * as bls from 'https://deno.land/x/bls12_381@1.4.0/mod.ts'
import { CGIExtension } from 'https://deno.land/x/bls_runtime_extension@v0.0.2/mod.ts'

async function main() {
	// Create the CGI Runtime Extension
	const sigVerify = new CGIExtension({
		name: 'extension-sig-verify',
		alias: 'sigverify',
		description: 'Signature and Verification extension for Heimdall'
	})

	// Export methods to runtime
	sigVerify.export('signBls', async ([message, privateKey]) => {
		// TODO: Explore multi signature signing
		const publicKey = bls.getPublicKey(privateKey)
		const signature = await bls.sign(message, privateKey)
		const isValid = await bls.verify(signature, message, publicKey)

		return isValid ? new TextDecoder().decode(signature) : false
	})

	// Execute and listen to incoming readable stream
	await sigVerify.execute()
}

main()
