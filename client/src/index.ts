import { ethers } from 'ethers'
import 'dotenv/config'

import { abi as swapAbi, address as swapAddress } from './data/swapAbi.json'
import { EMPTY_CERT, HARDHAT_PK1 } from './data/constants'
import { generateComplianceCertificate } from './utils/cert'

/**
 * Submit a transaction to the network along with a Heimdall compliance certificate
 *
 */
async function submitTransaction() {
	const provider = new ethers.JsonRpcProvider(process.env.WEB3_RPC_ENDPOINT)
	const signer = new ethers.Wallet(HARDHAT_PK1, provider)

	// Load the sample swap contract
	const swapInterface = new ethers.Interface(swapAbi)
	const swapContract = new ethers.Contract(swapAddress, swapInterface, signer)

	// Steps
	// 1. Check if contract is Heimdall Compliant
	const isHeimdallCompliant = await swapContract.isHeimdallCompliant()
	console.log('Is the contract Heimdall compliant ?', isHeimdallCompliant)

	// 2. Generate swap function data
	const baseData = await swapContract
		.getFunction('swap')
		.populateTransaction(ethers.ZeroAddress, ethers.ZeroAddress, 1 * 1e8, EMPTY_CERT)

	// 3. Build Raw Transaction
	const txData: ethers.TransactionLike = {
		chainId: Number((await provider.getNetwork()).chainId),
		type: 2,
		nonce: await signer.getNonce(),
		value: ethers.parseEther('0').toString(),
		from: await signer.getAddress(),
		...baseData
	}
	console.log('txData', txData)

	// 4. Generate compliance certificate and attach certificate to txData
	const txDataWithCertificate = await generateComplianceCertificate(txData)
	console.log(
		'txDataWithCertificate',
		swapInterface.decodeFunctionData('swap', txDataWithCertificate.data!)
	)

	// 5. Sign transaction with signer
	const tx = await signer.signTransaction(txDataWithCertificate)
	console.log('Signed Transaction:', tx)

	// 6. Submit transaction to network...
}

submitTransaction()
