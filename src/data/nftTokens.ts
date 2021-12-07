import { useMemo } from 'react'
import { omit } from 'ramda'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { NFTContracts } from '../types'
import { useCurrentChainName } from './chain'

export const nftTokensState = atom<Dictionary<NFTContracts>>({
  key: 'nftTokensState',
  default: JSON.parse(localStorage.getItem('NFT') || '{}'),
})

export const useManageNFTTokens = () => {
  const name = useCurrentChainName()
  const [tokens, setTokens] = useRecoilState(nftTokensState)

  const add = (params: NFTContracts) => {
    const next = { ...tokens, [name]: { ...tokens[name], ...params } }
    localStorage.setItem('NFT', JSON.stringify(next))
    setTokens(next)
  }

  const remove = (token: string) => {
    const next = { ...tokens, [name]: omit([token], tokens[name]) }
    localStorage.setItem('NFT', JSON.stringify(next))
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
