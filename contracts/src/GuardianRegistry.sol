// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GuardianRegistry {
	struct Guardian {
		address publicKey;
		bytes32 privateKey;
	}

	mapping(address => Guardian) public guardians;

	event GuardianAdded(address indexed guardianAddress);
	event GuardianRemoved(address indexed guardianAddress);

	// Add a new guardian
	function addGuardian(address _guardianAddress, bytes32 _privateKey) external {
		require(_guardianAddress != address(0), 'Guardian address cannot be zero address');
		require(guardians[_guardianAddress].publicKey != address(0), 'Guardian already exists');

		guardians[_guardianAddress] = Guardian({
			publicKey: _guardianAddress,
			privateKey: _privateKey
		});

		emit GuardianAdded(_guardianAddress);
	}

	// Remove a guardian
	function removeGuardian(address _guardianAddress) external {
		require(guardians[_guardianAddress].publicKey != address(0), 'Guardian does not exist');

		delete guardians[_guardianAddress];
		emit GuardianRemoved(_guardianAddress);
	}

	// Fetch a guardian's details
	function getGuardian(address _guardianAddress) external view returns (address, bytes32) {
		Guardian storage guardian = guardians[_guardianAddress];
		require(guardian.publicKey != address(0), 'Guardian does not exist');
		return (guardian.publicKey, guardian.privateKey);
	}
}
