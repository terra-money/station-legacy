import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { update } from 'ramda'
import { Field, Seed, Bip, SignUp, SignUpStep, Wallet } from '../types'
import { Account, BankData, Generate, BipList } from '../types'
import { useAuth } from '../contexts/AuthContext'
import fcd from '../api/fcd'
import useForm from '../hooks/useForm'
import { validateConfirm } from '../post/validateForm'
import { paste } from './helpers'
import wordlist from './wordlist.json'

interface Values {
  name: string
  password: string
  confirm: string
}

interface Params extends Omit<Values, 'confirm'> {
  wallet: Wallet
}

interface Props {
  generated?: Seed
  generateAddresses: Generate
  generateWallet: (phrase: string, bip: Bip) => Promise<Wallet>
  submit: (params: Params) => Promise<void>
  isNameExists: (name: string) => boolean
}

export default (props: Props): SignUp => {
  const { generated, generateAddresses, generateWallet, submit } = props
  const { isNameExists } = props
  const { t } = useTranslation()
  const { signIn } = useAuth()

  const ID = t('Auth:SignUp:Wallet name')
  const PW = t('Auth:Form:Password')

  /* form */
  const initial = { name: '', password: '', confirm: '' }

  const validate = ({ name, password, confirm }: Values) => ({
    name: !name.length
      ? t('Common:Validate:{{label}} is required', { label: ID })
      : name.length < 5 || name.length > 20
      ? t(
          'Common:Validate:{{label}} must be between {{min}} and {{max}} characters',
          { label: ID, min: 5, max: 20 }
        )
      : isNameExists(name)
      ? t('Common:Validate:{{label}} already exists', { label: ID })
      : '',
    ...validateConfirm({ password, confirm }, t),
  })

  const form = useForm<Values>(initial, validate)
  const { values, setValue, invalid, getDefaultProps, getDefaultAttrs } = form

  const fields: Field[] = [
    {
      ...getDefaultProps('name'),
      label: ID,
      attrs: {
        ...getDefaultAttrs('name'),
        placeholder: t('Auth:SignUp:Enter 5-20 alphanumeric characters'),
        autoFocus: true,
      },
      setValue: (value) => setValue('name', sanitize.name(value)),
    },
    {
      ...getDefaultProps('password'),
      label: PW,
      attrs: {
        ...getDefaultAttrs('password'),
        type: 'password',
        placeholder: t('Auth:Form:Must be at least 10 characters'),
      },
    },
    {
      ...getDefaultProps('confirm'),
      label: t('Auth:SignUp:Confirm password'),
      attrs: {
        ...getDefaultAttrs('confirm'),
        type: 'password',
        placeholder: t('Auth:SignUp:Confirm your password'),
      },
    },
  ]

  const [step, setStep] = useState<SignUpStep>()
  const onSubmit = () => (generated ? setStep('confirm') : fetchAccounts())

  /* Seed */
  const blank = Array.from({ length: 24 }, () => '')
  const [seed, setSeed] = useState<Seed>(generated ?? blank)
  const phrase = seed.join(' ')

  const phraseField: Field = {
    label: t('Auth:SignUp:Seed phrase'),
    element: 'textarea',
    attrs: { id: 'phrase', defaultValue: phrase, readOnly: true },
    copy: phrase,
  }

  const invalidWord = seed.find((word) => !wordlist.includes(word))

  const mnemonics = {
    title: t('Auth:SignUp:Seed phrase'),
    fields: seed.map((word, index) => {
      const label = String(index + 1)
      return {
        label,
        element: 'input' as const,
        attrs: { id: label, value: word, autoComplete: 'off' as const },
        setValue: (value: string) =>
          setSeed(update(index, sanitize.word(value), seed)),
      }
    }),
    warning:
      seed.every((word) => word.length) && invalidWord
        ? t('Auth:SignUp:{{word}} is an invalid word', { word: invalidWord })
        : undefined,
    paste: (clipboard: string, index: number = 0) =>
      setSeed(paste(index, toArray(clipboard), seed)),
    suggest: (input: string): string[] => {
      const list = wordlist.filter((word) => input && word.startsWith(input))
      return list.length === 1 && list.includes(input) ? [] : list
    },
  }

  /* Select account */
  const [accounts, setAccounts] = useState<Account[]>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      setAccounts(undefined)
      setError(undefined)

      const getPromise = (addr: string) => fcd.get<BankData>(`/v1/bank/${addr}`)

      const bipList: BipList = [118, 330]
      const addresses = await generateAddresses(phrase, bipList)
      const responses = await Promise.all(addresses.map(getPromise))
      const is118empty = Object.values(responses[0].data).every(
        (a) => !a.length
      )

      const getAccount = ({ data }: { data: BankData }, i: number): Account => {
        return { bip: bipList[i], address: addresses[i], bank: data }
      }

      const next = () => {
        setAccounts(responses.map(getAccount))
        setStep('select')
      }

      is118empty ? signUp() : next()
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  /* Sign up */
  const signUp = async (bip: Bip = 330) => {
    try {
      const { name, password } = values
      const wallet = await generateWallet(phrase, bip)
      const { terraAddress: address } = wallet
      await submit({ name, password, wallet })
      signIn({ name, address })
    } catch (error) {
      setError(error)
    }
  }

  const disabled = invalid || seed.some((word) => !word.length) || loading

  return Object.assign(
    {
      form: {
        title: generated
          ? t('Auth:Menu:New wallet')
          : t('Auth:Menu:Recover existing wallet'),
        fields: generated ? fields.concat(phraseField) : fields,
        disabled,
        submitLabel: loading
          ? t('Common:Form:Loading...')
          : t('Common:Form:Next'),
        onSubmit: disabled ? undefined : onSubmit,
      },
      mnemonics,
      warning: {
        tooltip: [
          t('Auth:SignUp:What if I lost my seed phrase?'),
          t(
            "Auth:SignUp:We cannot recover your information for you. If you lose your seed phrase it's GONE FOREVER. Terra Station does not store your mnemonic."
          ),
        ] as [string, string],
        i18nKey:
          'Auth:SignUp:I have securely <0>WRITTEN DOWN MY SEED</0>. I understand that lost seeds cannot be recovered.',
      },
      error,
    },
    step && {
      next: { step, seed, accounts, signUp },
      reset: () => setStep(undefined),
    }
  )
}

/* helpers */
const sanitize = {
  name: (s: string = '') => s.toLowerCase().replace(/[^a-z\d-_]/g, ''),
  word: (s: string = '') => s.toLowerCase().replace(/[^a-z]/g, ''),
}

const toArray = (s: string) =>
  s.trim().replace(/\s\s+/g, ' ').split(' ').map(sanitize.word)
