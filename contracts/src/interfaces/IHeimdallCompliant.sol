// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHeimdallCompliant {
	struct ComplianceCertificate {
		bool compliant;
		address senderAddress;
		address destAddress;
		string timestamp;
		address guardian;
		bytes signature;
	}

	function getPolicies() external view returns (address[] memory);

	function setPolicies(address[] calldata _policies) external;

	function verifyCertificate(ComplianceCertificate memory certificate) external view returns (bool);

	function isHeimdallCompliant() external pure returns (bool);
}
