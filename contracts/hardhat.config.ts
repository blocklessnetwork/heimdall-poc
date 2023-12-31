import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

const config: HardhatUserConfig = {
	solidity: '0.8.19',
	paths: {
		sources: './src'
	}
}

export default config
