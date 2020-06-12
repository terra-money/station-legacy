import React, { useState } from 'react'
import { Card as CardProps, useAuth } from '@terra-money/use-station'
import { ReactComponent as Ledger } from '../../images/Ledger.svg'
import ledger from '../../wallet/ledger'
import Card from '../../components/Card'
import Copy from '../../components/Copy'
import s from './Address.module.scss'

interface Props extends CardProps {
  viewAddress: string
}

const Address = ({ title, content, viewAddress }: Props) => {
  const payload = useViewAddress(viewAddress)

  return !content ? null : (
    <Card title={title} bordered>
      <Copy
        text={content}
        classNames={{ container: s.copy, text: s.text, button: s.button }}
        payload={payload}
        noLabel
      >
        {content}
      </Copy>
    </Card>
  )
}

export default Address

/* hook */
const useViewAddress = (viewAddress: string) => {
  const { user } = useAuth()
  const [clicked, setClicked] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  return user?.ledger
    ? {
        tooltip: errorMessage || viewAddress,
        clicked,
        onClick: async () => {
          setErrorMessage('')
          setClicked(true)
          setTimeout(() => setClicked(false), 1500)

          try {
            await ledger.showAddressInLedger()
          } catch (error) {
            setErrorMessage(error.message)
          }
        },
        children: <Ledger width={12} height={12} />
      }
    : undefined
}
