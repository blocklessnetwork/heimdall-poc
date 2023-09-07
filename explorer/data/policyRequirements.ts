export enum PolicyRequirement {
	BLOCK_OFAC_ASSETS = 0
}

const policyRequirementNames = [
	{
		id: PolicyRequirement.BLOCK_OFAC_ASSETS,
		name: 'Block OFAC Assets',
		descrption: 'This action verifies whether a specific address is included on the Office of Foreign Assets Control (OFAC) Blocked Assets list.'
	}
]

export function getPolicyRequirementData(id: PolicyRequirement) {
	return policyRequirementNames.find((r) => r.id === id)
}
