import { cgi } from '@blockless/sdk'

export function isExtensionAvailable(alias: string): boolean {
	let extensions = cgi.cgiExtendsList()
	let isMatch = false

	if (extensions && extensions.length > 0) {
		for (let i = 0; i < extensions.length; i++) {
			const extension = extensions[i]
			if (alias === extension.alias) {
				isMatch = true
			}
		}
	}

	return isMatch
}
