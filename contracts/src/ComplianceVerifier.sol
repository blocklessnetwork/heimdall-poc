// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

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
