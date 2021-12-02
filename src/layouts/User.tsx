import { useState } from 'react'
import c from 'classnames'
import { useText } from '../lib'
import { ReactComponent as Ledger } from '../images/Ledger.svg'
import { isExtension } from '../utils/env'
import { useModal } from '../hooks'
import * as ledger from '../wallet/ledger'
import { useUser } from '../data/auth'
import ManageWallet from '../auth/ManageWallet'
import Copy from '../components/Copy'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import ModalContent from '../components/ModalContent'
import AddressQRCode from './AddressQRCode'
import s from './User.module.scss'

const Name = ({ children: name }: { children: string }) => {
  const modal = useModal()

  return (
    <div className={s.name}>
      {isExtension && <Icon name="account_balance_wallet" size={16} />}
      {name}
      {!isExtension && (
        <>
          <button className={s.settings} onClick={modal.open}>
            <Icon name="settings" />
          </button>

          <Modal config={modal.config}>
            <ManageWallet />
          </Modal>
        </>
      )}
    </div>
  )
}

const Address = ({ children }: { children: string }) => {
  const { VIEW_ADDRESS } = useText()
  const viewAddress = useViewAddress(VIEW_ADDRESS)

  const modal = useModal()
  const showQRCode = {
    onClick: () =>
      modal.open(
        <ModalContent {...modal}>
          <AddressQRCode />
        </ModalContent>
      ),
    children: <Icon name="qr_code_2" size={12} />,
  }

  return !children ? null : (
    <>
      <Copy
        text={children}
        classNames={{ container: s.copy, text: s.text, button: s.button }}
        placement="bottom"
        payloads={viewAddress ? [showQRCode, viewAddress] : [showQRCode]}
        noLabel
      >
        {children}
      </Copy>
      <Modal {...modal}>{modal.content}</Modal>
    </>
  )
}

const User = ({ name, address }: User) => {
  return (
    <div className={c(s.user, isExtension ? s.extension : s.flex)}>
      {name && <Name>{name}</Name>}
      {address && <Address>{address}</Address>}
    </div>
  )
}

export default User

/* hook */
const useViewAddress = (viewAddress: string) => {
  const user = useUser()
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
