import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Dictionary, omit } from 'ramda'
import { ChainOptions, DefaultChainOptions } from '../../lib'
import useTerraAssets from '../../hooks/useTerraAssets'
import { localSettings } from '../../utils/localStorage'
import { useApp } from '../../hooks'
import { useManageChain } from '../../data/chain'

const chainsState = atom<Dictionary<ChainOptions>>({
  key: 'chainsState',
  default: {},
})

export const useInitChains = () => {
  const [chains, setChains] = useRecoilState(chainsState)
  const { data: Chains } =
    useTerraAssets<Dictionary<DefaultChainOptions>>('chains.json')

  const { customNetworks = [] } = localSettings.get()

  useEffect(() => {
    if (Chains) {
      const mergedChains: Dictionary<ChainOptions> = {
        ...Object.entries(Chains ?? {}).reduce((acc, [name, chain]) => {
          const fcd = chain.lcd.replace('lcd', 'fcd')
          const localterra = name === 'localterra'
          return { ...acc, [name]: { ...chain, fcd, localterra } }
        }, {}),
        ...customNetworks.reduce(
          (acc, item) =>
            Object.assign(
              {},
              acc,
              validateNetwork(item) && { [item.name]: item }
            ),
          {}
        ),
      }

      setChains(mergedChains)
    }
    // eslint-disable-next-line
  }, [Chains, JSON.stringify(customNetworks), setChains])

  return chains
}

export const useAddNetwork = () => {
  const { set } = useManageChain()
  const { push } = useHistory()
  const setChains = useSetRecoilState(chainsState)

  return (values: ChainOptions) => {
    const { customNetworks = [] } = localSettings.get()

    localSettings.set({
      customNetworks: [...customNetworks.filter(validateNetwork), values],
      chain: values.name,
    })

    set(values)
    setChains((prev) => ({ ...prev, [values.name]: values }))
    push('/')
  }
}

export const useDeleteNetwork = () => {
  const { refresh } = useApp()
  const setChains = useSetRecoilState(chainsState)

  return (name: string) => {
    const { customNetworks = [] } = localSettings.get()

    localSettings.set({
      customNetworks: customNetworks.filter((item) => item.name !== name),
    })

    setChains((prev) => omit([name], prev))
    refresh()
  }
}

const useMergedChains = () => {
  return useRecoilValue(chainsState)
}

export default useMergedChains

const keys: (keyof ChainOptions)[] = ['name', 'chainID', 'lcd', 'fcd']
export const validateNetwork = (item: ChainOptions) =>
  keys.every((key) => typeof item[key] === 'string')
