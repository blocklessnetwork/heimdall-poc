// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IHeimdallGuardianRegistry.sol';

contract HeimdallGuardianRegistry is IHeimdallGuardianRegistry {
	string public name;
	string public description;
	address public owner;

	struct Guardian {
		bytes publicKey;
	}

	mapping(address => Guardian) guardians;
	address[] public guardianAddresses;

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
	function addGuardian(address _guardianAddress, bytes memory _publicKey) external onlyOwner {
		require(_guardianAddress != address(0), 'Guardian address cannot be the zero address');
		require(guardians[_guardianAddress].publicKey.length == 0, 'Guardian already exists');

		guardians[_guardianAddress] = Guardian({publicKey: _publicKey});
		guardianAddresses.push(_guardianAddress); // Add the guardian address to the list

		emit GuardianAdded(_guardianAddress);
	}

	// Remove a guardian
	function removeGuardian(address _guardianAddress) external onlyOwner {
		require(guardians[_guardianAddress].publicKey.length > 0, 'Guardian does not exist');

		delete guardians[_guardianAddress];

		// Remove the guardian address from the list
		for (uint256 i = 0; i < guardianAddresses.length; i++) {
			if (guardianAddresses[i] == _guardianAddress) {
				if (i < guardianAddresses.length - 1) {
					guardianAddresses[i] = guardianAddresses[guardianAddresses.length - 1];
				}
				guardianAddresses.pop();
				break;
			}
		}

		emit GuardianRemoved(_guardianAddress);
	}

	// Check if an address is a guardian
	function isGuardian(address _address) external view returns (bool) {
		return guardians[_address].publicKey.length > 0;
	}

	// List all guardians' addresses and their public keys
	function listGuardians() external view returns (address[] memory, bytes[] memory) {
		uint256 numGuardians = guardianAddresses.length;
		address[] memory addresses = new address[](numGuardians);
		bytes[] memory publicKeys = new bytes[](numGuardians);

		for (uint256 i = 0; i < numGuardians; i++) {
			address guardianAddress = guardianAddresses[i];
			addresses[i] = guardianAddress;
			publicKeys[i] = guardians[guardianAddress].publicKey;
		}

		return (addresses, publicKeys);
	}
}
