import React, { useState } from 'react'
import { loadKeys, testPassword } from '../../utils/localStorage'
import { useForm, useAuth } from '../../hooks'
import ModalContent from '../../components/ModalContent'
import Select from '../../components/Select'
import Divider from '../../components/Divider'
import useModalActions from './useModalActions'
import Settings from './Settings'

const SignIn = () => {
  const accounts = loadKeys()

  /* context */
  const { goBack, close } = useModalActions()
  const auth = useAuth()

  /* form */
  type Values = { index: number; password: string }
  const initial = { index: 0, password: '' }
  const { values, handleChange } = useForm<Values>({ initial })
  const { index, password } = values

  /* sign in */
  const submit: Submit = e => {
    e.preventDefault()

    const { name, address } = accounts[index]
    testPassword(name, password)
      ? auth.signin({ name, address })
      : alert(`Signing In Failed\nPassword Error`)
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
        <h1>Sign in with password</h1>

        {!accounts.length ? (
          <p className="text-center">No accounts</p>
        ) : (
          <>
            <section className="form-group">
              <label className="label">Select account</label>
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
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Must be at least 10 characters"
                className="form-control"
                autoComplete="off"
                autoFocus
              />
            </section>

            <Divider />
            <button
              type="submit"
              className="btn btn-block btn-primary"
              disabled={password.length < 10}
            >
              Sign In
            </button>
          </>
        )}
      </form>
    </ModalContent>
  )
}

export default SignIn
