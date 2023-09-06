// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHeimdallGuardianRegistry {
	function name() external view returns (string memory);

	function description() external view returns (string memory);

	function owner() external view returns (address);

	function addGuardian(address _guardianAddress, bytes memory _publicKey) external;

	function removeGuardian(address _guardianAddress) external;

	function isGuardian(address _address) external view returns (bool);

	event GuardianAdded(address indexed guardianAddress);
	event GuardianRemoved(address indexed guardianAddress);
}
