import hre from 'hardhat'
import { expect } from 'chai'
import { CompliancePolicy } from '../typechain-types'

describe('CompliancePolicy', function () {
	let compliancePolicy: CompliancePolicy

	before(async () => {
		const contractFactory = await hre.ethers.getContractFactory('CompliancePolicy')
		compliancePolicy = await contractFactory.deploy('Sample Policy', '1.0', true)
	})

	it('should have the correct initial values', async function () {
		expect(await compliancePolicy.name()).to.equal('Sample Policy')
		expect(await compliancePolicy.version()).to.equal('1.0')
		expect(await compliancePolicy.isBlockOfacAssetsEnabled()).to.equal(true)
	})
})
