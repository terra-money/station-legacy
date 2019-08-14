import axios from 'axios'
import socketCluster, { SCClientSocket } from 'socketcluster-client'

interface Chain {
  fcd: string
  socket: SCClientSocket.ClientOptions
}

const Chain = { COLUMBUS_2: 'columbus-2', VODKA: 'vodka' }
export const ChainList = [Chain.COLUMBUS_2, Chain.VODKA]
const Chains: { [slug: string]: Chain } = {
  [Chain.COLUMBUS_2]: {
    fcd: 'https://fcd.terra.dev',
    socket: { hostname: 'fcd.terra.dev', port: 443, secure: true }
  },
  [Chain.VODKA]: {
    fcd: 'https://vodka-fcd.terra.dev',
    socket: { hostname: 'vodka-fcd.terra.dev', port: 443, secure: true }
  }
}

const instance = axios.create()

instance.interceptors.request.use(({ params, ...config }) => ({
  ...config,
  params: { ...params, _t: Date.now() }
}))

export const changeChain = (slug: string) =>
  (instance.defaults.baseURL = Chains[slug]['fcd'])

export default instance

/* socket */
export const useSocket = (chain: string) => {
  const { socket } = Chains[chain]
  return socketCluster.create(socket)
}
