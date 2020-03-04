import React, { ReactNode } from 'react'
import { useAuth, User } from '@terra-money/use-station'
import PleaseSignIn from '../components/PleaseSignIn'

interface Props {
  card?: boolean
  children: (user: User) => ReactNode
}

const WithAuth = ({ card, children }: Props) => {
  const { user } = useAuth()
  return !user ? <PleaseSignIn card={card} /> : <>{children(user)}</>
}

export default WithAuth
