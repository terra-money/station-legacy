import React, { useState, ReactNode } from 'react'
import { toast } from 'react-toastify'
import { cond, equals } from 'ramda'
import c from 'classnames'
import { useManageAccounts } from '@terra-money/use-station'
import { electron } from '../utils'
import { loadKeys, storeKeys, importKey } from '../utils/localStorage'
import ModalContent from '../components/ModalContent'
import Confirm from '../components/Confirm'
import Icon from '../components/Icon'
import Pop from '../components/Pop'
import Toast from '../components/Toast'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'
import s from './ManageAccounts.module.scss'

type Props = {
  modalActions: { goBack: () => void; close: () => void }
  onFinish: () => void
}

const ManageAccounts = ({ modalActions, onFinish }: Props) => {
  const { title, password } = useManageAccounts()
  const { tooltip, ...toastProps } = password
  const Page = { PW: 'ChangePassword', DEL: 'DeleteAccount' }
  const [accounts, setAccounts] = useState(loadKeys)
  const [currentPage, setCurrentPage] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

  const init = () => {
    setAccounts(loadKeys)
    setCurrentPage('')
    setCurrentIndex(-1)
  }

  /* actions */
  type Params = { current: string; password: string }
  const account = accounts[currentIndex]
  const changePassword = async ({ current, password }: Params) => {
    const { name, wallet } = account
    const decrypted = electron<string>('decrypt', [wallet, current])
    const parsed = JSON.parse(decrypted)

    deleteAccount()
    await importKey({ name, password, wallet: parsed })
    toast(<Toast {...toastProps} />, { autoClose: 3000 })
    onFinish()
  }

  const deleteAccount = () => {
    const next = accounts.filter((_, i) => i !== currentIndex)
    storeKeys(next)
    next.length ? init() : onFinish()
  }

  /* render */
  const buttons = [
    {
      icon: 'lock',
      tooltip,
      getAttrs: (index: number) => ({
        className: c('btn-icon', s.hover),
        onClick: () => {
          setCurrentPage(Page.PW)
          setCurrentIndex(index)
        },
      }),
    },
    {
      icon: 'delete',
      getAttrs: (index: number) => ({
        className: 'btn-icon text-danger',
        onClick: () => {
          setCurrentPage(Page.DEL)
          setCurrentIndex(index)
        },
      }),
    },
  ]

  const main = (
    <Confirm title={title}>
      <ul>
        {accounts.map(({ name }, index) => (
          <li className={s.item} key={name}>
            {name}

            <section className="btn-icon-group">
              {buttons.map(({ icon, tooltip, getAttrs }) => {
                const attrs = {
                  ...getAttrs(index),
                  children: <Icon name={icon} size={20} />,
                  key: icon,
                }

                return tooltip ? (
                  <Pop type="tooltip" placement="top" content={tooltip}>
                    {({ ref, getAttrs }) => (
                      <span {...getAttrs(attrs)} ref={ref} />
                    )}
                  </Pop>
                ) : (
                  <button {...attrs} />
                )
              })}
            </section>
          </li>
        ))}
      </ul>
    </Confirm>
  )

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

export default ManageAccounts
