import React, { useState, ReactNode } from 'react'
import { toast } from 'react-toastify'
import { cond, equals } from 'ramda'
import { useAuth, useManageAccounts } from '@terra-money/use-station'
import { electron } from '../utils'
import { loadKeys, storeKeys, importKey } from '../utils/localStorage'
import ModalContent from '../components/ModalContent'
import Toast from '../components/Toast'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'
import AuthMenu from './AuthMenu'

type Props = {
  name: string
  modalActions: { close: () => void }
  onFinish: () => void
}

const ManageWallet = ({ name, modalActions, onFinish }: Props) => {
  const manage = useManageAccounts()
  const { signOut } = useAuth()
  const Page = { PW: 'ChangePassword', DEL: 'DeleteAccount' }
  const [accounts, setAccounts] = useState(loadKeys)
  const [currentPage, setCurrentPage] = useState<string>('')

  const init = () => {
    setAccounts(loadKeys)
    setCurrentPage('')
  }

  /* actions */
  type Params = { current: string; password: string }
  const account = accounts.find((account) => account.name === name)!

  const changePassword = async ({ current, password }: Params) => {
    const { name, wallet } = account
    const decrypted = electron<string>('decrypt', [wallet, current])
    const parsed = JSON.parse(decrypted)

    deleteAccount()
    await importKey({ name, password, wallet: parsed })
    toast(<Toast {...manage.password} />, { autoClose: 3000 })
    onFinish()
  }

  const deleteAccount = () => {
    const next = accounts.filter((account) => account.name !== name)
    signOut()
    storeKeys(next)
    next.length ? init() : onFinish()
  }

  /* render */
  const buttons = [
    {
      title: manage.password.tooltip,
      icon: 'lock',
      onClick: () => setCurrentPage(Page.PW),
    },
    {
      title: manage.delete.title!,
      icon: 'delete',
      onClick: () => setCurrentPage(Page.DEL),
    },
  ]

  const main = <AuthMenu list={buttons} />

  const renderPage = cond<string, ReactNode>([
    [
      equals(Page.PW),
      () => <ChangePassword name={account['name']} onChange={changePassword} />,
    ],
    [
      equals(Page.DEL),
      () => <DeleteAccount onDelete={deleteAccount} onCancel={init} />,
    ],
  ])(currentPage)

  return (
    <ModalContent
      {...Object.assign({}, modalActions, currentPage && { goBack: init })}
    >
      {renderPage || main}
    </ModalContent>
  )
}

export default ManageWallet
