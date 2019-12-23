import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { loadKeys, testPassword } from '../../utils/localStorage'
import { useForm, useAuth } from '../../hooks'
import ModalContent from '../../components/ModalContent'
import InvalidFeedback from '../../components/InvalidFeedback'
import Select from '../../components/Select'
import Divider from '../../components/Divider'
import useModalActions from './useModalActions'
import Settings from './Settings'

const SignIn = () => {
  const accounts = loadKeys()
  const { t } = useTranslation()

  /* context */
  const { goBack, close } = useModalActions()
  const auth = useAuth()

  /* form */
  type Values = { index: number; password: string }
  const initial = { index: 0, password: '' }
  const { values, changeValue, handleChange } = useForm<Values>({ initial })
  const { index, password } = values

  /* sign in */
  const [incorrect, setIncorrect] = useState<string>('')

  const handleChangePassword = (password: string) => {
    setIncorrect('')
    changeValue({ password })
  }

  const submit: Submit = e => {
    e.preventDefault()

    const { name, address } = accounts[index]
    testPassword(name, password)
      ? auth.signin({ name, address })
      : setIncorrect(t('Incorrect password'))
  }

  /* render */
  const [settings, setSettings] = useState<boolean>(false)
  return settings ? (
    <Settings
      modalActions={{ goBack: () => setSettings(false), close }}
      onDeleteAll={goBack}
    />
  ) : (
    <ModalContent
      goBack={goBack}
      close={close}
      actions={
        !!accounts.length
          ? [{ icon: 'settings', onClick: () => setSettings(true) }]
          : undefined
      }
    >
      <form onSubmit={submit}>
        <h1>{t('Sign in with password')}</h1>

        {!accounts.length ? (
          <p className="text-center">{t('No accounts')}</p>
        ) : (
          <>
            <section className="form-group">
              <label className="label">{t('Select account')}</label>
              <Select
                name="index"
                value={index}
                onChange={handleChange}
                className="form-control"
              >
                {accounts.map(({ name }, index) => (
                  <option value={index} key={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </section>

            <section className="form-group">
              <label className="label">{t('Password')}</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={e => handleChangePassword(e.target.value)}
                placeholder={t('Must be at least 10 characters')}
                className="form-control"
                autoComplete="off"
                autoFocus
              />
              {incorrect && (
                <InvalidFeedback tooltip>{incorrect}</InvalidFeedback>
              )}
            </section>

            <Divider />
            <button
              type="submit"
              className="btn btn-block btn-primary"
              disabled={password.length < 10}
            >
              {t('Sign in')}
            </button>
          </>
        )}
      </form>
    </ModalContent>
  )
}

export default SignIn
