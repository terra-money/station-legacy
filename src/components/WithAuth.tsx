import React, { FC } from 'react'
import { useApp, useAuth } from '../hooks'
import Card from './Card'
import Info from './Info'

type Props = { card?: boolean }

const WithAuth: FC<Props> = ({ card, children }) => {
  const { authModal } = useApp()
  const { address } = useAuth()

  const signIn = (
    <span onClick={authModal.open} className="text-secondary clickable">
      sign in
    </span>
  )

  const info = (
    <Info icon="account_circle" title="Sign In Required">
      This page shows data for a specific address. To access the page, please{' '}
      {signIn}.
    </Info>
  )

  return address ? <>{children}</> : card ? <Card>{info}</Card> : info
}

export default WithAuth
