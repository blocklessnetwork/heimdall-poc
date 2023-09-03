// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IHeimdallCompliancePolicy.sol';

contract CompliancePolicy is IHeimdallCompliancePolicy {
	string public name;
	string public version;
	address public policyCreator;
	ComplianceRequirements public complianceRequirements;

	constructor(string memory _name, string memory _version, bool _blockOfacAssets) {
		require(bytes(_name).length > 0, 'Name must not be empty');
		require(bytes(_version).length > 0, 'Version must not be empty');
		require(
			_blockOfacAssets == true || _blockOfacAssets == false,
			'BlockOfacAssets must be a boolean'
		);

		name = _name;
		version = _version;
		policyCreator = msg.sender;

		complianceRequirements = ComplianceRequirements({blockOfacAssets: _blockOfacAssets});
	}

	// Getter function to check the value of blockOfacAssets
	function isBlockOfacAssetsEnabled() external view returns (bool) {
		return complianceRequirements.blockOfacAssets;
	}
}
