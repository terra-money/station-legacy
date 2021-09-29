import { useState } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { useManageAccounts } from '../lib'
import { isExtension } from '../utils/env'
import { useAuth, useUser } from '../data/auth'
import ModalContent from '../components/ModalContent'
import { useAuthModal } from './useAuthModal'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'
import AuthMenu from './AuthMenu'
import GenerateQRCode from './GenerateQRCode'

const ManageWallet = () => {
  const user = useUser()
  const { signOut } = useAuth()
  const authModal = useAuthModal()
  const { push, goBack } = useHistory()
  const { path, url } = useRouteMatch()
  const manage = useManageAccounts()

  const [currentIndex, setCurrentIndex] = useState(-1)

  const onFinishSubmenu = isExtension
    ? () => goBack()
    : () => setCurrentIndex(-1)

  const renderQRCode = () => <GenerateQRCode />
  const renderExportKey = () => <GenerateQRCode exportKey />
  const renderChangePassword = () => (
    <ChangePassword onFinish={onFinishSubmenu} />
  )

  const renderDeleteAccount = () => <DeleteAccount onFinish={onFinishSubmenu} />

  /* render */
  const list: {
    title: string
    icon: string
    path?: string
    render?: () => JSX.Element
    onClick?: () => void
  }[] = !user?.ledger
    ? [
        {
          title: 'Export with QR code',
          icon: 'qr_code',
          path: '/qrcode',
          render: renderQRCode,
        },
        {
          title: 'Export private key',
          icon: 'notes',
          path: '/export',
          render: renderExportKey,
        },
        {
          title: manage.password.tooltip,
          icon: 'lock',
          path: '/password',
          render: renderChangePassword,
        },
        {
          title: manage.delete.title!,
          icon: 'delete',
          path: '/delete',
          render: renderDeleteAccount,
        },
      ]
    : []

  list.push({
    title: 'Disconnect',
    icon: 'exit_to_app',
    onClick: () => signOut(),
  })

  const renderMenu = () => (
    <AuthMenu
      list={list.map((item, index) => ({
        ...item,
        onClick:
          item.onClick ??
          (() =>
            isExtension ? push(url + item.path) : setCurrentIndex(index)),
      }))}
    />
  )

  const modal = {
    ...authModal,
    goBack: currentIndex > -1 ? () => setCurrentIndex(-1) : undefined,
  }

  return isExtension ? (
    <Switch>
      <Route path={path + '/'} exact render={renderMenu} />
      <Route path={path + '/password'} render={renderChangePassword} />
      <Route path={path + '/delete'} render={renderDeleteAccount} />
      <Route path={path + '/qrcode'} render={renderQRCode} />
      <Route
        path={path + '/export'}
        render={() => <GenerateQRCode exportKey />}
      />
    </Switch>
  ) : (
    <ModalContent {...modal}>
      {list[currentIndex]?.render?.() ?? renderMenu()}
    </ModalContent>
  )
}

export default ManageWallet
