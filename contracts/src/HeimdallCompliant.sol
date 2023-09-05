// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IHeimdallCompliant.sol';
import './interfaces/IHeimdallGuardianRegistry.sol';
import './utils/BLS.sol';

abstract contract HeimdallCompliant is IHeimdallCompliant {
	address[] private policies;
	IHeimdallGuardianRegistry public guardianRegistry;
	address public owner;

	constructor(address _guardianRegistryAddress) {
		owner = msg.sender;
		guardianRegistry = IHeimdallGuardianRegistry(_guardianRegistryAddress);
	}

	modifier onlyOwner() {
		require(msg.sender == owner, 'Only the owner can call this function');
		_;
	}

	function isHeimdallCompliant() external pure returns (bool) {
		return true;
	}

	function getPolicies() external view override returns (address[] memory) {
		return policies;
	}

	function setPolicies(address[] calldata _policies) external override onlyOwner {
		policies = _policies;
	}

	function verifyCertificate(ComplianceCertificate memory certificate) external returns (bool) {
		require(certificate.compliant, 'Invalid certificate');
		require(guardianRegistry.isGuardian(certificate.guardian), 'Guardian does not exist');

		// TODO: Swap BLS Verification Key
		Pairing.G2Point memory verificationKey = Pairing.G2Point({
			x: [
				18523194229674161632574346342370534213928970227736813349975332190798837787897,
				5725452645840548248571879966249653216818629536104756116202892528545334967238
			],
			y: [
				3816656720215352836236372430537606984911914992659540439626020770732736710924,
				677280212051826798882467475639465784259337739185938192379192340908771705870
			]
		});

		bytes memory message = abi.encodePacked(
			certificate.compliant,
			certificate.senderAddress,
			certificate.destAddress,
			certificate.timestamp
		);

		return BLS.verify(verificationKey, message, certificate.signature);
	}
}
