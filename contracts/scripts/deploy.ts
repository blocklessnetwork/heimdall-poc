import { ethers } from 'hardhat'

async function main() {
	// Setup Guardian
	console.log('Setting up guardian registry ...')
	const guardianRegistry = await ethers.deployContract('HeimdallGuardianRegistry', [
		'Guardian Registry',
		'Sample Guardian Registry'
	])
	await guardianRegistry.waitForDeployment()
	console.log('Guardian registry deployed!', await guardianRegistry.getAddress())
	// await guardianRegistry.connect(owner).addGuardian(guardian.address)

	console.log('\n---------\n')

	// Setup Compliance Policy
	console.log('Setting up compliance policy ...')
	const compliancePolicy = await ethers.deployContract('HeimdallCompliancePolicy', [
		'Sample Policy',
		'1.0.0',
		[0],
		[true]
	])
	await compliancePolicy.waitForDeployment()
	console.log('Compliance policy deployed!', await compliancePolicy.getAddress())

	console.log('\n---------\n')

	// Setup sample swap contract
	console.log('Setting up sample swap ...')
	const swapCompliantProtocol = await ethers.deployContract('SampleSwap', [
		await guardianRegistry.getAddress()
	])
	await swapCompliantProtocol.waitForDeployment()
	console.log('Sample swap deployed!', await swapCompliantProtocol.getAddress())

	// Add policies
	await swapCompliantProtocol.setPolicies([await compliancePolicy.getAddress()])

	console.log('Sample swap deployed!')
}

// Start the script
main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
