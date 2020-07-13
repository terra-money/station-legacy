import React from 'react'
import { useInteract, useAuth } from '@terra-money/use-station'
import CoinFields from './CoinFields'
import Post from './Post'
import WithActiveDenoms from './WithActiveDenoms'

interface Props {
  address: string
}

const Component = ({ address, denoms }: Props & { denoms: string[] }) => {
  const { user } = useAuth()
  const response = useInteract(address, user!, denoms)
  const { ui } = response
  return (
    <Post post={response} formProps={{ children: <CoinFields {...ui!} /> }} />
  )
}

const Interact = (props: Props) => (
  <WithActiveDenoms>
    {(denoms) => <Component {...props} denoms={['uluna', ...denoms]} />}
  </WithActiveDenoms>
)

export default Interact
