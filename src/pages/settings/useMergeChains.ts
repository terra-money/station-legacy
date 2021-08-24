import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { Dictionary, omit } from 'ramda'
import { ChainOptions, DefaultChainOptions } from '../../lib'
import { useConfig } from '../../lib'
import useTerraAssets from '../../lib/hooks/useTerraAssets'
import { localSettings } from '../../utils/localStorage'
import { useApp } from '../../hooks'

const chainsState = atom<Dictionary<ChainOptions>>({
  key: 'chainsState',
  default: {},
})

export const useInitChains = () => {
  const setChains = useSetRecoilState(chainsState)
  const { data: Chains, loading } =
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

  return loading
}

export const useAddNetwork = () => {
  const { chain } = useConfig()
  const { push } = useHistory()
  const setChains = useSetRecoilState(chainsState)

  return (values: ChainOptions) => {
    const { customNetworks = [] } = localSettings.get()

    localSettings.set({
      customNetworks: [...customNetworks.filter(validateNetwork), values],
      chain: values.name,
    })

    chain.set(values)
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

const useChains = () => {
  return useRecoilValue(chainsState)
}

export default useChains

const keys: (keyof ChainOptions)[] = ['name', 'chainID', 'lcd', 'fcd']
export const validateNetwork = (item: ChainOptions) =>
  keys.every((key) => typeof item[key] === 'string')
