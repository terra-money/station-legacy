import { Config, InitialConfigState } from '../types'
import createContext from './createContext'
import useLang from './useLang'
import useCurrency from './useCurrency'
import useChain from './useChain'

export const [useConfig, ConfigProvider] = createContext<Config>()

export const useConfigState = (initial: InitialConfigState): Config => {
  const lang = useLang(initial.lang)
  const chain = useChain(initial.chain)
  const currency = useCurrency(initial.currency)
  return { lang, currency, chain }
}
