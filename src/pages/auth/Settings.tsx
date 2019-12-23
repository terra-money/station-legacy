import React, { useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cond, equals } from 'ramda'
import { loadKeys, storeKeys } from '../../utils/localStorage'
import Icon from '../../components/Icon'
import Confirm from '../../components/Confirm'
import ModalContent from '../../components/ModalContent'
import DeleteAccount from './DeleteAccount'
import s from './Settings.module.scss'

type Props = {
  modalActions: { goBack: () => void; close: () => void }
  onDeleteAll: () => void
}

const Settings = ({ modalActions, onDeleteAll }: Props) => {
  const { t } = useTranslation()

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
    <Confirm title={t('Manage accounts')}>
      {!accounts.length ? (
        <p className="text-center">{t('No accounts')}</p>
      ) : (
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
      )}
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

export default Settings
