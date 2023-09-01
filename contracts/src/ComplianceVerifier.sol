// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';

struct MyStruct {
	bool compliant;
	string senderAddress;
	uint256 senderAddressNonce;
	string destAddress;
	string timestamp;
}

interface IComplianceVerifier {
	function getPolicies() external view returns (address[] memory);

	function setPolicies(address[] calldata _policies) external;
}

contract ComplianceVerifier is IComplianceVerifier, Ownable {
	address[] private policies;

	function getPolicies() external view override returns (address[] memory) {
		return policies;
	}

	function setPolicies(address[] calldata _policies) external override onlyOwner {
		require(msg.sender == owner(), 'Only the owner can set policies');
		policies = _policies;
	}
}
