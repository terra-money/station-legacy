import React from 'react'
import { useSend, useAuth } from '../lib'
import useTokenBalance from '../lib/cw20/useTokenBalance'
import FormInformation from '../components/FormInformation'
import ExtLink from '../components/ExtLink'
import Post from './Post'

const Send = ({ denom }: { denom: string }) => {
  const { user } = useAuth()
  const tokenBalance = useTokenBalance(user!.address)
  const response = useSend(user!, denom, tokenBalance)

  const formProps = {
    renderBeforeFields: () => (
      <FormInformation>
        <p>
          Use <ExtLink href="https://bridge.terra.money">Terra Bridge</ExtLink>{' '}
          for cross-chain transfers
        </p>
      </FormInformation>
    ),
  }

  return <Post post={response} formProps={formProps} />
}

export default Send
