// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IHeimdallCompliancePolicy.sol';

contract HeimdallCompliancePolicy is IHeimdallCompliancePolicy {
	string public name;
	string public version;

	mapping(ComplianceRequirement => bool) public requirements;

	constructor(
		string memory _name,
		string memory _version,
		ComplianceRequirement[] memory _requirements,
		bool[] memory _isActive
	) {
		require(bytes(_name).length > 0, 'Name must not be empty');
		require(bytes(_version).length > 0, 'Version must not be empty');
		require(_requirements.length == _isActive.length, 'Input arrays length mismatch');

		for (uint256 i = 0; i < _requirements.length; i++) {
			require(
				uint256(_requirements[i]) <= uint256(ComplianceRequirement.BlockOfacAssets),
				'Invalid Compliance Requirement'
			);
			requirements[_requirements[i]] = _isActive[i];
		}

		name = _name;
		version = _version;
	}

	// Function to check the state of a ComplianceRequirement
	function isRequirement(ComplianceRequirement _requirement) external view returns (bool) {
		return requirements[_requirement];
	}

	// Function to get all ComplianceRequirements that are true
	function getRequirements() external view returns (ComplianceRequirement[] memory) {
		uint256 trueCount = 0;

		// Loop through all ComplianceRequirements
		for (uint256 i = 0; i <= uint256(ComplianceRequirement.BlockOfacAssets); i++) {
			if (requirements[ComplianceRequirement(i)]) {
				trueCount++;
			}
		}

		// Create an array to store the true ComplianceRequirements
		ComplianceRequirement[] memory trueRequirements = new ComplianceRequirement[](trueCount);
		uint256 index = 0;

		// Populate the trueRequirements array
		for (uint256 i = 0; i <= uint256(ComplianceRequirement.BlockOfacAssets); i++) {
			if (requirements[ComplianceRequirement(i)]) {
				trueRequirements[index] = ComplianceRequirement(i);
				index++;
			}
		}

		return trueRequirements;
	}
}
