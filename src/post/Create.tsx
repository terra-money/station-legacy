import React from 'react'
import { useCreate, useAuth } from '@terra-money/use-station'
import CoinFields from './CoinFields'
import Post from './Post'
import WithActiveDenoms from './WithActiveDenoms'

const Component = ({ denoms }: { denoms: string[] }) => {
  const { user } = useAuth()
  const response = useCreate(user!, denoms)
  const { ui } = response
  return (
    <Post post={response} formProps={{ children: <CoinFields {...ui!} /> }} />
  )
}

const Create = () => (
  <WithActiveDenoms>
    {(denoms) => <Component denoms={['uluna', ...denoms]} />}
  </WithActiveDenoms>
)

export default Create
