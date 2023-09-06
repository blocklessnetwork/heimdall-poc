import hre from 'hardhat'
import { expect } from 'chai'
import { HeimdallGuardianRegistry } from '../typechain-types'

describe('HeimdallGuardianRegistry', function () {
	let guardianRegistry: HeimdallGuardianRegistry
	let guardianBytes = hre.ethers.hexlify(hre.ethers.randomBytes(48))

	beforeEach(async function () {
		let contractFactory = await hre.ethers.getContractFactory('HeimdallGuardianRegistry')
		guardianRegistry = await contractFactory.deploy('MyRegistry', 'Description')
	})

	it('should initialize correctly', async function () {
		const [owner] = await hre.ethers.getSigners()
		expect(await guardianRegistry.name()).to.equal('MyRegistry')
		expect(await guardianRegistry.description()).to.equal('Description')
		expect(await guardianRegistry.owner()).to.equal(owner.address)
	})

	it('should add and retrieve a guardian', async function () {
		const [owner, guardian] = await hre.ethers.getSigners()

		// Add a guardian
		await guardianRegistry.connect(owner).addGuardian(guardian.address, guardianBytes)

		// Retrieve the guardian's details
		const isGuardian = await guardianRegistry.isGuardian(guardian.address)

		expect(isGuardian).to.equal(true)
	})

	it('should remove a guardian', async function () {
		const [owner, guardian] = await hre.ethers.getSigners()

		// Add a guardian
		await guardianRegistry.connect(owner).addGuardian(guardian.address, guardianBytes)

		// Remove the guardian
		await guardianRegistry.connect(owner).removeGuardian(guardian.address)

		// Attempt to retrieve the guardian's details (should fail)
		const isGuardian = await guardianRegistry.isGuardian(guardian.address)
		expect(isGuardian).to.equal(false)
	})

	it('should not add a guardian with zero address', async function () {
		const [owner] = await hre.ethers.getSigners()

		// Attempt to add a guardian with the zero address
		await expect(
			guardianRegistry.connect(owner).addGuardian(hre.ethers.ZeroAddress, hre.ethers.ZeroHash)
		).to.be.revertedWith('Guardian address cannot be the zero address')
	})

	it('should not add a duplicate guardian', async function () {
		const [owner, guardian] = await hre.ethers.getSigners()

		// Add a guardian
		await guardianRegistry.connect(owner).addGuardian(guardian.address, guardianBytes)

		// Attempt to add the same guardian again (should fail)
		await expect(
			guardianRegistry.connect(owner).addGuardian(guardian.address, guardianBytes)
		).to.be.revertedWith('Guardian already exists')
	})

	it('should check if an address is a guardian', async function () {
		const [_, guardian] = await hre.ethers.getSigners()

		// Check if an address that hasn't been added is a guardian
		const isGuardian = await guardianRegistry.isGuardian(guardian.address)
		expect(isGuardian).to.equal(false)
	})

	it('should only allow the owner to add and remove guardians', async function () {
		const [_, guardian, nonOwner] = await hre.ethers.getSigners()

		// Attempt to add a guardian as a non-owner (should fail)
		await expect(
			guardianRegistry.connect(nonOwner).addGuardian(guardian.address, guardianBytes)
		).to.be.revertedWith('Only the owner can call this function')

		// Attempt to remove a guardian as a non-owner (should fail)
		await expect(
			guardianRegistry.connect(nonOwner).removeGuardian(guardian.address)
		).to.be.revertedWith('Only the owner can call this function')
	})
})
