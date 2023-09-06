import hre from 'hardhat'
import { expect } from 'chai'
import { SampleSwap, HeimdallGuardianRegistry, HeimdallCompliancePolicy } from '../typechain-types'

describe('HeimdallCompliant', function () {
	let swapCompliantProtocol: SampleSwap
	let compliancePolicy: HeimdallCompliancePolicy
	let guardianRegistry: HeimdallGuardianRegistry

	beforeEach(async () => {
		const [owner, guardian] = await hre.ethers.getSigners()
		let guardianBytes = hre.ethers.hexlify(hre.ethers.randomBytes(48))

		// Setup Guardian
		let guardianRegistryFactory = await hre.ethers.getContractFactory('HeimdallGuardianRegistry')
		guardianRegistry = await guardianRegistryFactory.deploy('MyRegistry', 'Description')
		await guardianRegistry.connect(owner).addGuardian(guardian.address, guardianBytes)

		// Setup Compliance Policy
		const policyContractFactory = await hre.ethers.getContractFactory('HeimdallCompliancePolicy')
		compliancePolicy = await policyContractFactory.deploy(
			'Sample Policy',
			'1.0.0',
			[0], // Index value for the enum
			[true]
		)

		// Setup sample swap contract
		const contractFactory = await hre.ethers.getContractFactory('SampleSwap')
		swapCompliantProtocol = await contractFactory.deploy(await guardianRegistry.getAddress())
	})

	it('should set the owner and guardianRegistry correctly in the constructor', async function () {
		expect(await swapCompliantProtocol.guardianRegistry()).to.equal(
			await guardianRegistry.getAddress()
		)
	})

	it('should allow the owner to set policies', async function () {
		const [owner] = await hre.ethers.getSigners()

		const newPolicies = [await compliancePolicy.getAddress()]

		await swapCompliantProtocol.connect(owner).setPolicies(newPolicies)

		const policies = await swapCompliantProtocol.getPolicies()
		expect(policies).to.deep.equal(newPolicies)
	})

	it('should not allow non-owners to set policies', async function () {
		const [owner, guardian, nonOwner] = await hre.ethers.getSigners()

		const newPolicies = [await compliancePolicy.getAddress()]

		await expect(
			swapCompliantProtocol.connect(nonOwner).setPolicies(newPolicies)
		).to.be.revertedWith('Only the owner can call this function')
	})

	it('should revert when swapping with an invalid certificate', async function () {
		const [_, guardian, fromAddress, toAddress] = await hre.ethers.getSigners()

		const from = fromAddress
		const to = toAddress
		const amount = hre.ethers.parseEther('1.0')

		const certificate = {
			compliant: false,
			senderAddress: from,
			destAddress: to,
			timestamp: Math.floor(Date.now() / 1000),
			guardian,
			signature: hre.ethers.randomBytes(32)
		}

		await expect(swapCompliantProtocol.swap(from, to, amount, certificate)).to.be.revertedWith(
			'Invalid certificate'
		)
	})
})
