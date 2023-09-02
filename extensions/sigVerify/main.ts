import { CGIExtension } from 'https://deno.land/x/bls_runtime_extension@v0.0.2/mod.ts'

async function main() {
	// Create the CGI Runtime Extension
	const sigVerify = new CGIExtension({
		name: 'heimdall-sig-verify',
		alias: 'sigverify',
		description: 'Signature and Verification extension for Heimdall'
	})

	// Export methods to runtime
	sigVerify.export('sign', (...params) => {
		// TODO: Implement signature logic here.
		return '0xSignature'
	})

	// Execute and listen to incoming readable stream
	await sigVerify.execute()
}

main()
