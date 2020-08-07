import React, { useState } from 'react'
import { useAuth, useText } from '@terra-money/use-station'
import { ReactComponent as Ledger } from '../images/Ledger.svg'
import ledger from '../wallet/ledger'
import Copy from '../components/Copy'
import s from './User.module.scss'

const Name = ({ children }: { children: string }) => {
  return <div className={s.name}>{children}</div>
}

const Address = ({ children }: { children: string }) => {
  const { VIEW_ADDRESS } = useText()
  const payload = useViewAddress(VIEW_ADDRESS)

  return !children ? null : (
    <Copy
      text={children}
      classNames={{ container: s.copy, text: s.text, button: s.button }}
      placement="bottom"
      payload={payload}
      noLabel
    >
      {children}
    </Copy>
  )
}

const User = ({ name, address }: User) => {
  return (
    <div className={s.user}>
      {name && <Name>{name}</Name>}
      {address && <Address>{address}</Address>}
    </div>
  )
}

export default User

/* hook */
const useViewAddress = (viewAddress: string) => {
  const { user } = useAuth()
  const [clicked, setClicked] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  return user?.ledger
    ? {
        tooltip: errorMessage || viewAddress,
        placement: 'bottom',
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
        children: <Ledger width={12} height={12} />,
      }
    : undefined
}
