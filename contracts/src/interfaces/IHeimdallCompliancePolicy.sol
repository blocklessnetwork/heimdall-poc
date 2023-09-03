// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHeimdallCompliancePolicy {
	enum ComplianceRequirement {
		BlockOfacAssets
	}
	
	function getRequirements() external view returns (ComplianceRequirement[] memory);

	function isRequirement(ComplianceRequirement) external view returns (bool);
}
