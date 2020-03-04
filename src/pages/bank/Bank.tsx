import React from 'react'
import { useMenu } from '@terra-money/use-station'
import WithAuth from '../../auth/WithAuth'
import Page from '../../components/Page'
import Assets from './Assets'

const Bank = () => {
  const { Bank: title } = useMenu()

  return (
    <Page title={title}>
      <WithAuth card>{user => <Assets user={user} />}</WithAuth>
    </Page>
  )
}

export default Bank
