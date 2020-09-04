import React from 'react'
import { useMenu } from '@terra-money/use-station'
import { isExtension } from '../../utils/env'
import WithAuth from '../../auth/WithAuth'
import Page from '../../components/Page'
import Assets from './Assets'

const Bank = () => {
  const { Wallet: title } = useMenu()

  return (
    <Page title={isExtension ? undefined : title}>
      <WithAuth card>{(user) => <Assets user={user} />}</WithAuth>
    </Page>
  )
}

export default Bank
