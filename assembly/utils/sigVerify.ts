import { Console } from 'as-wasi/assembly'
import { cgi } from '@blockless/sdk'
import { isExtensionAvailable } from './ext'

const EXTENSION_NAME = 'sigverify'

/**
 * Sign a message hash with the bls signature
 * 
 * @param messageHash
 * @param privateKey
 * @returns
 */
function signBls(messageHash: string, privateKey: string): string | boolean {
	if (!isExtensionAvailable(EXTENSION_NAME)) return false

	let response: string | boolean = false
	let command = new cgi.CgiCommand(EXTENSION_NAME, [messageHash, privateKey], [])
	let rs = command.exec()

	if (rs === true) {
		response = command.callMethod('signBls', [messageHash, privateKey])
	}

	command.close()
	return response
}
