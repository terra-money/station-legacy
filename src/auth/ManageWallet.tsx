import React, { useEffect, useState } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { useAuth, useManageAccounts } from '@terra-money/use-station'
import { isExtension } from '../utils/env'
import ModalContent from '../components/ModalContent'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'
import AuthMenu from './AuthMenu'

interface Props {
  modalActions: { close: () => void }
  onFinish?: () => void
}

const ManageWallet = ({ modalActions, onFinish }: Props) => {
  const { user, signOut } = useAuth()
  const { push } = useHistory()
  const { path, url } = useRouteMatch()
  const manage = useManageAccounts()

  const [currentIndex, setCurrentIndex] = useState(-1)

  useEffect(() => {
    !user && push('/')
  }, [user, push])

  /* render */
  const list = [
    {
      title: manage.password.tooltip,
      icon: 'lock',
      path: '/password',
      render: () => <ChangePassword onFinish={() => setCurrentIndex(-1)} />,
    },
    {
      title: manage.delete.title!,
      icon: 'delete',
      path: '/delete',
      render: () => <DeleteAccount />,
    },
    {
      title: 'Disconnect',
      icon: 'exit_to_app',
      onClick: () => signOut(),
    },
  ]

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
    ...modalActions,
    goBack: currentIndex > -1 ? () => setCurrentIndex(-1) : undefined,
  }

  return isExtension ? (
    <Switch>
      <Route path={path + '/'} exact render={renderMenu} />
      <Route path={path + '/password'} component={ChangePassword} />
      <Route path={path + '/delete'} component={DeleteAccount} />
    </Switch>
  ) : (
    <ModalContent {...modal}>
      {list[currentIndex]?.render?.() ?? renderMenu()}
    </ModalContent>
  )
}

export default ManageWallet
