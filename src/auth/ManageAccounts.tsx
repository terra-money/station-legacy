import React, { useState, ReactNode } from 'react'
import { cond, equals } from 'ramda'
import { useManageAccounts } from '@terra-money/use-station'
import { loadKeys, storeKeys } from '../utils/localStorage'
import ModalContent from '../components/ModalContent'
import Confirm from '../components/Confirm'
import Icon from '../components/Icon'
import DeleteAccount from './DeleteAccount'
import s from './ManageAccounts.module.scss'

type Props = {
  modalActions: { goBack: () => void; close: () => void }
  onDeleteAll: () => void
}

const ManageAccounts = ({ modalActions, onDeleteAll }: Props) => {
  const { title } = useManageAccounts()
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
  const deleteAccount = () => {
    const next = accounts.filter((_, i) => i !== currentIndex)
    storeKeys(next)
    next.length ? init() : onDeleteAll()
  }

  /* render */
  const buttons = [
    {
      icon: 'delete',
      getAttrs: (index: number) => ({
        className: 'btn-icon text-danger',
        onClick: () => {
          setCurrentPage(Page.DEL)
          setCurrentIndex(index)
        }
      })
    }
  ]

  const main = (
    <Confirm title={title}>
      <ul>
        {accounts.map(({ name }, index) => (
          <li className={s.item} key={name}>
            {name}

            <section className="btn-icon-group">
              {buttons.map(({ icon, getAttrs }) => (
                <button {...getAttrs(index)} type="button" key={icon}>
                  <Icon name={icon} size={20} />
                </button>
              ))}
            </section>
          </li>
        ))}
      </ul>
    </Confirm>
  )

  const renderPage = cond<string, ReactNode>([
    [
      equals(Page.DEL),
      () => <DeleteAccount onDelete={deleteAccount} onCancel={init} />
    ]
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
