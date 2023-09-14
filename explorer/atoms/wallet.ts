import { atomWithStorage } from 'jotai/utils'

const addressDefault = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
const address = atomWithStorage('wallet_address', addressDefault)
const networkRPC = atomWithStorage('wallet_network_rpc', process.env.NEXT_PUBLIC_RPC_ENDPOINT)
const blsRPC = atomWithStorage('wallet_bls_rpc', process.env.NEXT_PUBLIC_BLS_ENDPOINT)

export default {
	address,
	addressDefault,
	networkRPC,
	blsRPC
}
