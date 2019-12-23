import React, { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import electron from '../../helpers/electron'
import { OOPS } from '../../helpers/constants'
import { importKey, loadKeys } from '../../utils/localStorage'
import api from '../../api/api'
import { useForm, useAuth } from '../../hooks'
import Pop from '../../components/Pop'
import Icon from '../../components/Icon'
import Copy from '../../components/Copy'
import Flex from '../../components/Flex'
import ModalContent from '../../components/ModalContent'
import InvalidFeedback from '../../components/InvalidFeedback'
import Divider from '../../components/Divider'
import useModalActions from './useModalActions'
import Phrases from './Phrases'
import SelectAccount from './SelectAccount'

type Values = {
  name: string
  password: string
  confirm: string
  phrases: string[]
  written: boolean
}

type Props = { title: string; initial: () => Values; generated?: boolean }

const bipList = [118, 330]

const AccountForm = ({ title, initial, generated }: Props) => {
  const { t } = useTranslation()

  /* context */
  const auth = useAuth()
  const { goBack, close } = useModalActions()

  /* validation: account */
  const validate = ({ name, password, confirm, phrases, written }: Values) => ({
    name: !name.length
      ? t('Account name is required')
      : name.length < 5 || name.length > 20
      ? t('Account name must be between 5 and 20 characters')
      : isNameExists(name)
      ? t('Account name already exists')
      : '',
    password: !password.length
      ? t('Password is required')
      : password.length < 10
      ? t('Password must be longer than 10 characters')
      : '',
    confirm: password !== confirm ? t('Password does not match') : '',
    phrases: !phrases.every(w => !!w.length) ? t('Invalid phrase') : '',
    written: !written ? 'Recovery confirmation is required' : ''
  })

  const parse = ({ name, ...values }: Values): Values => ({
    name: sanitize(name),
    ...values
  })

  /* form: account */
  const form = useForm<Values>({ initial, validate, parse })
  const { values, changeValue, handleChange, touched, error, invalid } = form
  const { name, password, confirm, phrases, written } = values

  /* state: select account */
  type Account = { bip: number; address: string; bank: Bank }
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const init = () => {
    setAccounts([])
    setHasError(false)
    setErrorMessage('')
  }

  const handleError = (error: Error) => {
    setHasError(true)
  }

  /* submit */
  const fetchBank = async () => {
    setIsLoading(true)

    try {
      const getPromise = (address: string) =>
        api.get<Bank>(`/v1/bank/${address}`)

      const getData = (res: { data: Bank }, index: number): Account => ({
        bip: bipList[index],
        address: addresses[index],
        bank: res.data
      })

      type Addresses = Promise<string[]>
      const addresses = await electron<Addresses>('generateAddresses', phrase)
      const responses = await Promise.all(addresses.map(getPromise))
      setIsLoading(false)
      const is118Empty = isEmptyAddress(responses[0].data)
      is118Empty ? submit() : setAccounts(responses.map(getData))
    } catch (error) {
      setIsLoading(false)
      handleError(error)
    }
  }

  const phrase = phrases.join(' ')

  const handleSubmit: Submit = async e => {
    e.preventDefault()
    generated ? submit() : fetchBank()
  }

  const submit = async (bip: number = bipList[bipList.length - 1]) => {
    try {
      const params = [phrase, bip]
      const wallet = await electron<Wallet>('generateWalletFromSeed', params)
      await importKey({ name, password, wallet })
      auth.signin({ name, address: wallet.terraAddress })
    } catch (error) {
      handleError(error)
      setErrorMessage(error.message)
    }
  }

  /* render */
  const renderError = (key: string) =>
    touched[key] && <InvalidFeedback tooltip>{error[key]}</InvalidFeedback>

  return hasError ? (
    <ModalContent goBack={init} close={close}>
      <p>{errorMessage || OOPS}</p>
    </ModalContent>
  ) : !accounts.length ? (
    <ModalContent goBack={goBack} close={close}>
      <form onSubmit={handleSubmit}>
        <h1>{title}</h1>
        <section className="form-group">
          <label className="label">{t('Account name')}</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder={t('Enter 5-20 alphanumeric characters')}
            className="form-control"
            autoComplete="off"
            autoFocus
          />
          {renderError('name')}
        </section>

        <section className="form-group">
          <label className="label">{t('Password')}</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder={t('Must be at least 10 characters')}
            className="form-control"
            autoComplete="off"
          />
          {renderError('password')}
        </section>

        <section className="form-group">
          <label className="label">{t('Confirm password')}</label>
          <input
            type="password"
            name="confirm"
            value={confirm}
            onChange={handleChange}
            placeholder={t('Confirm your password')}
            className="form-control"
            autoComplete="off"
          />
          {renderError('confirm')}
        </section>

        <section className="form-group">
          {generated ? (
            <>
              <header className="flex space-between">
                <label className="label">{t('Seed phrase')}</label>
                <Copy
                  text={phrase}
                  buttonLabel={t('Copy')}
                  classNames={{ button: 'label-button text-secondary' }}
                />
              </header>
              <textarea
                name="phrase"
                defaultValue={phrase}
                rows={3}
                className="form-control"
                autoComplete="off"
                readOnly={generated}
              />
            </>
          ) : (
            <>
              <label className="label">{t('Seed phrase')}</label>
              <Phrases
                list={phrases}
                onChange={(phrases: string[]) => changeValue({ phrases })}
              />
            </>
          )}
        </section>

        {generated && (
          <Pop
            type="tooltip"
            placement="top"
            content={t(
              "We cannot recover your information for you. If you lose your seed phrase it's GONE FOREVER. Station doesn't store any data."
            )}
            fullWidth
          >
            {({ ref, iconRef, getAttrs }) => (
              <Flex
                {...getAttrs({ className: 'form-text text-danger' })}
                forwardRef={ref}
              >
                <Icon name="error" />
                <strong ref={iconRef}>
                  {t('What if I lost my seed phrase?')}
                </strong>
              </Flex>
            )}
          </Pop>
        )}

        {generated && (
          <section className="form-group form-check" key={name}>
            <input
              type="checkbox"
              id="written"
              name="written"
              checked={written}
              onChange={() => changeValue({ written: !written })}
            />
            <label htmlFor="written">
              <Trans i18nKey="written down my seed">
                I have securely <strong>WRITTEN DOWN MY SEED</strong>. I
                understand that lost seeds cannot be recovered.
              </Trans>
            </label>
          </section>
        )}

        <Divider />
        <button
          type="submit"
          className="btn btn-block btn-primary"
          disabled={invalid || isLoading}
        >
          {isLoading ? 'Loading...' : title}
        </button>
      </form>
    </ModalContent>
  ) : (
    <ModalContent goBack={() => setAccounts([])} close={close}>
      <SelectAccount title={title} list={accounts} onSelect={submit} />
    </ModalContent>
  )
}

export default AccountForm

/* helpers */
const sanitize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z\d-_]/g, '')

const isNameExists = (name: string): boolean => {
  const keys = loadKeys()
  return !!keys.find(key => key.name === name)
}

const isEmptyAddress = (bank: Bank) => {
  const { balance, vesting, delegations = [], unbondings = [] } = bank
  const list = [balance, vesting, delegations, unbondings]
  return list.every(item => !item.length)
}
