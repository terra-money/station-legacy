import axios from 'axios'

const Chain = { COLUMBUS_2: 'columbus-2', VODKA: 'vodka' }
export const ChainList = [Chain.COLUMBUS_2, Chain.VODKA]
const Chains: { [slug: string]: { [env: string]: string } } = {
  [Chain.COLUMBUS_2]: {
    production: 'https://fcd.terra.dev',
    development: 'https://fcd.terra.dev'
  },
  [Chain.VODKA]: {
    production: 'https://vodka-fcd.terra.dev',
    development: 'https://vodka-fcd.terra.dev'
  }
}

const instance = axios.create()

instance.interceptors.request.use(({ params, ...config }) => ({
  ...config,
  params: { ...params, _t: Date.now() }
}))

export const changeChain = (slug: string) =>
  (instance.defaults.baseURL = Chains[slug][process.env.NODE_ENV])

export default instance
