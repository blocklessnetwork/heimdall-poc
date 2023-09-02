// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './GuardianRegistry.sol';

struct Certificate {
	bool compliant;
	address senderAddress;
	uint256 senderAddressNonce;
	address destAddress;
	string timestamp;
	address guardian;
	bytes signature;
}

interface IComplianceVerifier {
	function getPolicies() external view returns (address[] memory);

	function setPolicies(address[] calldata _policies) external;

	function verifyCertificate(Certificate memory certificate) external view returns (bool);
}

abstract contract ComplianceVerifier is IComplianceVerifier {
	address[] private policies;
	GuardianRegistry public guardianRegistry;
	address public owner;

	constructor(address _guardianRegistryAddress) {
		owner = msg.sender;
		guardianRegistry = GuardianRegistry(_guardianRegistryAddress);
	}

	modifier onlyOwner() {
		require(msg.sender == owner, 'Only the owner can call this function');
		_;
	}

	function getPolicies() external view override returns (address[] memory) {
		return policies;
	}

	function setPolicies(address[] calldata _policies) external override onlyOwner {
		policies = _policies;
	}

	function verifyCertificate(Certificate memory certificate) external view returns (bool) {
		require(guardianRegistry.isGuardian(certificate.guardian), 'Guardian does not exist.');

		// TODO: Implement verification logic here

		return certificate.compliant;
	}
}
