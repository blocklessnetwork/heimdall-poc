export function shortenString(input: string, len = 8): string {
	if (input.length <= len * 2) {
		return input
	}

	const shortened = input.substr(0, len) + ' ... ' + input.substr(-len)
	return shortened
}
