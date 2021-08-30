import { omit } from 'ramda'
import { useMemo } from 'react'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { useCurrentChainName, Whitelist } from '../lib'

export const tokensState = atom<Dictionary<Whitelist>>({
  key: 'tokensState',
  default: JSON.parse(localStorage.getItem('tokens') || '{}'),
})

export const useManageTokens = () => {
  const name = useCurrentChainName()
  const [tokens, setTokens] = useRecoilState(tokensState)

  const add = (params: Whitelist) => {
    const next = { ...tokens, [name]: { ...tokens[name], ...params } }
    localStorage.setItem('tokens', JSON.stringify(next))
    setTokens(next)
  }

  const remove = (token: string) => {
    const next = { ...tokens, [name]: omit([token], tokens[name]) }
    localStorage.setItem('tokens', JSON.stringify(next))
    setTokens(next)
  }

  return { add, remove }
}

export const useTokens = () => {
  const tokens = useRecoilValue(tokensState)
  const name = useCurrentChainName()
  const placeholder = useMemo(() => ({}), [])
  return tokens[name] ?? placeholder
}
