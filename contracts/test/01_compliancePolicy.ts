import hre from 'hardhat'
import { expect } from 'chai'
import { HeimdallCompliancePolicy } from '../typechain-types'

enum ComplianceRequirement {
	BlockOfacAssets = 0
}

describe('HeimdallCompliancePolicy', function () {
	let compliancePolicy: HeimdallCompliancePolicy

	beforeEach(async () => {
		const contractFactory = await hre.ethers.getContractFactory('HeimdallCompliancePolicy')
		compliancePolicy = await contractFactory.deploy(
			'Sample Policy',
			'1.0.0',
			[ComplianceRequirement.BlockOfacAssets], // Index value for the enum
			[true]
		)
	})

	it('should set the name and version correctly', async () => {
		expect(await compliancePolicy.name()).to.equal('Sample Policy')
		expect(await compliancePolicy.version()).to.equal('1.0.0')
	})

	it('should set compliance requirements and return their states', async () => {
		expect(await compliancePolicy.isRequirement(ComplianceRequirement.BlockOfacAssets)).to.be.true
	})

	it('should get all true compliance requirements', async () => {
		const trueRequirements = await compliancePolicy.getRequirements()
		expect(trueRequirements).to.have.lengthOf(1)
		expect(trueRequirements[0]).to.equal(ComplianceRequirement.BlockOfacAssets)
	})
})
