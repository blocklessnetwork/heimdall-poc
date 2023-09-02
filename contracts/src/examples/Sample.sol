// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../ComplianceVerifier.sol';

contract Sample is ComplianceVerifier {
	constructor(address guardianRegistry) ComplianceVerifier(guardianRegistry) {}

	function swap(address from, address to) external {
		_swap(from, to);
	}

	function swap(address from, address to, Certificate memory certificate) external {
		require(this.verifyCertificate(certificate), 'Invalid certificate');
		_swap(from, to);
	}

	function _swap(address from, address to) internal {
		// TODO: Implement the swap logic here
	}
}
