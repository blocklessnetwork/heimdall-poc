// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Pairing.sol';

/**
 * @title BLS
 * @dev A library for verifying BLS signatures.
 * Based on the work of https://gist.github.com/BjornvdLaan/ca6dd4e3993e1ef392f363ec27fe74c4,
 * which is licensed under Apache 2.0 (https://www.apache.org/licenses/LICENSE-2.0).
 *
 */
library BLS {
	/**
	 * @dev Checks if a BLS signature is valid.
	 * @param _verificationKey Public verification key associated with the secret key that signed the message.
	 * @param _message Message that was signed.
	 * @param _signature Signature over the message.
	 * @return True if the message was correctly signed.
	 */
	function verify(
		Pairing.G2Point memory _verificationKey,
		bytes memory _message,
		bytes memory _signature
	) internal returns (bool) {
		Pairing.G1Point memory messageHash = Pairing.hashToG1(_message);
		Pairing.G1Point memory signature = Pairing.hashToG1(_signature);

		return Pairing.pairing2(signature, Pairing.P2(), messageHash, _verificationKey);
	}
}
