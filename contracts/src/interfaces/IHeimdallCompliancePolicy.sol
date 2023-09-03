// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHeimdallCompliancePolicy {
	struct ComplianceRequirements {
		bool blockOfacAssets;
	}

	function isBlockOfacAssetsEnabled() external view returns (bool);
}
