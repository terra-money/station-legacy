import { useMemo } from 'react'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { omit } from 'ramda'
import { NFTWhitelist } from '../lib'
import { useCurrentChainName } from './chain'

export const tokensState = atom<Dictionary<NFTWhitelist>>({
  key: 'tokensState',
  default: JSON.parse(localStorage.getItem('tokens') || '{}'),
})

export const nftTokensState = atom<Dictionary<NFTWhitelist>>({
  key: 'nftTokensState',
  default: JSON.parse(localStorage.getItem('nftTokens') || '{}'),
})

export const useManageTokens = () => {
  const name = useCurrentChainName()
  const [tokens, setTokens] = useRecoilState(tokensState)

  const add = (params: NFTWhitelist) => {
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

export const useManageNFTTokens = () => {
  const name = useCurrentChainName()
  const [tokens, setTokens] = useRecoilState(nftTokensState)

  const add = (params: NFTWhitelist) => {
    const next = { ...tokens, [name]: { ...tokens[name], ...params } }
    localStorage.setItem('nftTokens', JSON.stringify(next))
    setTokens(next)
  }

  const remove = (token: string) => {
    const next = { ...tokens, [name]: omit([token], tokens[name]) }
    localStorage.setItem('nftTokens', JSON.stringify(next))
    setTokens(next)
  }

  return { add, remove }
}

export const useNFTTokens = () => {
  const tokens = useRecoilValue(nftTokensState)

  const name = useCurrentChainName()
  const placeholder = useMemo(() => ({}), [])
  return tokens[name] ?? placeholder
}
