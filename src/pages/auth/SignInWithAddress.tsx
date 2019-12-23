import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useValidate from '../../api/validate'
import { format } from '../../utils'
import { localSettings } from '../../utils/localStorage'
import { useForm, useAuth } from '../../hooks'
import Icon from '../../components/Icon'
import ModalContent from '../../components/ModalContent'
import InvalidFeedback from '../../components/InvalidFeedback'
import Divider from '../../components/Divider'
import useModalActions from './useModalActions'
import s from './SignInWithAddress.module.scss'

const SignInWithAddress = () => {
  const { t } = useTranslation()

  /* context */
  const auth = useAuth()
  const modalActions = useModalActions()
  const v = useValidate()

  /* form */
  type Values = { address: string }
  const validate = ({ address }: Values) => ({ address: v.address(address) })
  const form = useForm<Values>({ initial: { address: '' }, validate })
  const { values, handleChange, touched, error, invalid } = form
  const { address } = values

  /* state */
  const { recentAddresses = [] } = localSettings.get()
  const [recent, setRecent] = useState<string[]>(recentAddresses)
  const handleDelete = () => {
    localSettings.delete(['recentAddresses'])
    setRecent([])
  }

  /* auth */
  const submit: Submit = e => {
    e.preventDefault()
    auth.signin({ address })
  }

  /* render */
  const renderError = (key: string) =>
    touched[key] && <InvalidFeedback tooltip>{error[key]}</InvalidFeedback>

  return (
    <ModalContent {...modalActions}>
      <form onSubmit={submit}>
        <h1>{t('Sign in with address')}</h1>
        <section className="form-group">
          <label className="label">{t('Wallet address')}</label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={handleChange}
            placeholder={t('Input your wallet address')}
            className="form-control"
            autoComplete="off"
            autoFocus
          />
          {renderError('address')}
        </section>

        {!!recent.length && (
          <section className="form-group">
            <header className="flex space-between">
              <label className="label">{t('Recent addresses')}</label>
              <button
                onClick={handleDelete}
                className="label-button text-danger"
                type="button"
              >
                <Icon name="delete" size={12} />
                {t('Delete all')}
              </button>
            </header>

            <ul className={s.list}>
              {recent.map(address => (
                <li className={s.item} key={address}>
                  <button onClick={() => auth.signin({ address })}>
                    {format.truncate(address, [9, 7])}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Divider />
        <button
          type="submit"
          disabled={invalid}
          className="btn btn-block btn-primary"
        >
          {t('Sign in')}
        </button>
      </form>
    </ModalContent>
  )
}

export default SignInWithAddress
