import { atomWithStorage } from 'jotai/utils'

const addressDefault = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
const address = atomWithStorage('wallet_address', addressDefault)
const networkRPC = atomWithStorage('wallet_network_rpc', 'http://127.0.0.1:8545')
const blsRPC = atomWithStorage('wallet_bls_rpc', 'http://127.0.0.1:3000')

export default {
	address,
	addressDefault,
	networkRPC,
	blsRPC
}
