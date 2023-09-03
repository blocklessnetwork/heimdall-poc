// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Guardian {
	address publicKey;
}

contract GuardianRegistry {
	string public name;
	string public description;
	address public owner;

	mapping(address => Guardian) guardians;

	event GuardianAdded(address indexed guardianAddress);
	event GuardianRemoved(address indexed guardianAddress);

	modifier onlyOwner() {
		require(msg.sender == owner, 'Only the owner can call this function');
		_;
	}

	constructor(string memory _name, string memory _description) {
		owner = msg.sender;
		name = _name;
		description = _description;
	}

	// Add a new guardian
	function addGuardian(address _guardianAddress) external onlyOwner {
		require(_guardianAddress != address(0), 'Guardian address cannot be the zero address');
		require(guardians[_guardianAddress].publicKey == address(0), 'Guardian already exists');

		guardians[_guardianAddress] = Guardian({publicKey: _guardianAddress});

		emit GuardianAdded(_guardianAddress);
	}

	// Remove a guardian
	function removeGuardian(address _guardianAddress) external onlyOwner {
		require(guardians[_guardianAddress].publicKey != address(0), 'Guardian does not exist');

		delete guardians[_guardianAddress];
		emit GuardianRemoved(_guardianAddress);
	}

	// Check if an address is a guardian
	function isGuardian(address _address) external view returns (bool) {
		return guardians[_address].publicKey != address(0);
	}
}
