// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../HeimdallCompliant.sol';

contract SampleSwap is HeimdallCompliant {
	event SwapEvent(address indexed from, address indexed to, uint256 amount);

	constructor(address guardianRegistry) HeimdallCompliant(guardianRegistry) {}

	function swap(address from, address to, uint256 amount) internal {
		_swap(from, to, amount);
	}

	function swap(
		address from,
		address to,
		uint256 amount,
		ComplianceCertificate memory certificate
	) external {
		require(this.verifyCertificate(certificate), 'Invalid certificate');
		_swap(from, to, amount);
	}

	function _swap(address from, address to, uint256 amount) internal {
		// TODO: Implement the swap logic here
		emit SwapEvent(from, to, amount);
	}
}
