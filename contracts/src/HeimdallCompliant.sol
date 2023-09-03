// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IHeimdallCompliant.sol';
import './interfaces/IHeimdallGuardianRegistry.sol';

abstract contract HeimdallCompliant is IHeimdallCompliant {
	address[] private policies;
	IHeimdallGuardianRegistry public guardianRegistry;
	address public owner;

	constructor(address _guardianRegistryAddress) {
		owner = msg.sender;
		guardianRegistry = IHeimdallGuardianRegistry(_guardianRegistryAddress);
	}

	modifier onlyOwner() {
		require(msg.sender == owner, 'Only the owner can call this function');
		_;
	}

	function isHeimdallCompliant() external pure returns (bool) {
		return true;
	}

	function getPolicies() external view override returns (address[] memory) {
		return policies;
	}

	function setPolicies(address[] calldata _policies) external override onlyOwner {
		policies = _policies;
	}

	function verifyCertificate(
		ComplianceCertificate memory certificate
	) external view returns (bool) {
		require(guardianRegistry.isGuardian(certificate.guardian), 'Guardian does not exist.');

		// TODO: Implement verification logic here

		return certificate.compliant;
	}
}
