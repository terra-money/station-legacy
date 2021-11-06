import { Dictionary } from 'ramda'
import { useCurrentChainName } from '../data/chain'
import { Whitelist } from '../types'

const cw721_hardcoded: Dictionary<Whitelist> = {
  mainnet: {
    terra1t0l0sz0efnr7cm3hxked7nn2x7xx5syw02k8tc: {
      symbol: 'PEEPS',
      token: 'terra1t0l0sz0efnr7cm3hxked7nn2x7xx5syw02k8tc',
      icon: 'icon',
    },
    terra103z9cnqm8psy0nyxqtugg6m7xnwvlkqdzm4s4k: {
      symbol: 'GP',
      token: 'terra103z9cnqm8psy0nyxqtugg6m7xnwvlkqdzm4s4k',
      icon: 'icon',
    },
    terra1whyze49j9d0672pleaflk0wfufxrh8l0at2h8q: {
      symbol: 'TRNT',
      token: 'terra1whyze49j9d0672pleaflk0wfufxrh8l0at2h8q',
      icon: 'icon',
    },
    terra13qrc9j00lk3x0rvpptzdmwtckfj64d5g6xnrv9: {
      symbol: 'TLOOT',
      token: 'terra13qrc9j00lk3x0rvpptzdmwtckfj64d5g6xnrv9',
      icon: 'icon',
    },
  },
  testnet: {},
}

const useWhitelist = () => {
  const name = useCurrentChainName()
  //const response = useTerraAssets<Dictionary<Whitelist>>('cw721/tokens.json')
  const response: Dictionary<Whitelist> = cw721_hardcoded
  console.log(response)
  return { ...response, whitelist: response?.[name], isLoading: false }
  //return { ...response, whitelist: response.data?.[name] ,isLoading:false}
}

export default useWhitelist
