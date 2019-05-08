import React, { useState } from 'react'
import v from '../../api/validate'
import { format } from '../../utils'
import { getRecent, clearRecent } from '../../utils/localStorage'
import { useForm, useAuth } from '../../hooks'
import Icon from '../../components/Icon'
import ModalContent from '../../components/ModalContent'
import InvalidFeedback from '../../components/InvalidFeedback'
import Divider from '../../components/Divider'
import useModalActions from './useModalActions'
import s from './SignInWithAddress.module.scss'

const SignInWithAddress = () => {
  /* context */
  const auth = useAuth()
  const modalActions = useModalActions()

  /* form */
  type Values = { address: string }
  const validate = ({ address }: Values) => ({ address: v.address(address) })
  const form = useForm<Values>({ initial: { address: '' }, validate })
  const { values, handleChange, touched, error, invalid } = form
  const { address } = values

  /* state */
  const [recent, setRecent] = useState<string[]>(getRecent)
  const handleDelete = () => {
    clearRecent()
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
        <h1>Sign in with address</h1>
        <section className="form-group">
          <label className="label">Wallet address</label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={handleChange}
            placeholder="Input your wallet address"
            className="form-control"
            autoComplete="off"
            autoFocus
          />
          {renderError('address')}
        </section>

        {!!recent.length && (
          <section className="form-group">
            <header className="flex space-between">
              <label className="label">Recent addresses</label>
              <button
                onClick={handleDelete}
                className="label-button text-danger"
                type="button"
              >
                <Icon name="delete" size={12} />
                Delete all
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
          Sign in
        </button>
      </form>
    </ModalContent>
  )
}

export default SignInWithAddress
