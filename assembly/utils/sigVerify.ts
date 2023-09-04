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
export function signBls(messageHash: string, privateKey: string): string {
	if (!isExtensionAvailable(EXTENSION_NAME)) return '0x'

	let response: string = '0x'
	let command = new cgi.CgiCommand(EXTENSION_NAME, [messageHash, privateKey], [])
	let rs = command.exec()

	if (rs === true) {
		response = command.callMethod('signBls', [messageHash, privateKey])
	}

	command.close()

	return response
}
