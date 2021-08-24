import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { update } from 'ramda'
import numeral from 'numeral'
import { Field, ConfirmSeed, Seed, SignUpFn } from '../types'
import { shuffle } from './helpers'

interface Props {
  seed: Seed
  signUp: SignUpFn
}

export default ({ seed, signUp }: Props): ConfirmSeed => {
  const { t, i18n } = useTranslation()

  /* shuffle */
  const n = 2
  const array24 = Array.from({ length: seed.length }, (_, i) => i)

  const [quiz, setQuiz] = useState<number[]>([])
  const [hint, setHint] = useState<number[]>([])

  useEffect(() => {
    const shuffled = shuffle(array24)
    const quiz = shuffled.slice(0, n).sort()
    const hint = shuffle(shuffled.slice(0, n * 3))
    setQuiz(quiz)
    setHint(hint)
    // eslint-disable-next-line
  }, [])

  /* form */
  const init = () => Array.from({ length: n }, () => '')
  const [values, setValues] = useState<string[]>(init)
  const disabled = values.some((value, index) => value !== seed[quiz[index]])
  const fields: Field[] = quiz.map((q, index) => {
    const label = t('Auth:SignUp:{{index}} word', {
      index: i18n.language === 'en' ? numeral(q + 1).format('0o') : q + 1,
    })

    return {
      label,
      element: 'input',
      attrs: {
        type: 'text',
        id: label,
        value: values[index],
        placeholder: t('Auth:SignUp:Select or type'),
        autoComplete: 'off',
        autoFocus: !index,
      },
      setValue: (value: string) => setValues(update(index, value, values)),
    }
  })

  const [submitted, setSubmitted] = useState(false)
  const onSubmit = async () => {
    await signUp()
    setSubmitted(true)
  }

  return {
    form: {
      title: t('Auth:SignUp:Confirm your seed'),
      fields,
      disabled,
      submitLabel: t('Auth:SignUp:Create a wallet'),
      onSubmit: disabled ? undefined : onSubmit,
    },
    hint: hint.map((index) => {
      const word = seed[index]
      return {
        label: word,
        onClick: (index) => setValues(update(index, word, values)),
      }
    }),
    result: !submitted
      ? undefined
      : {
          title: t('Auth:SignUp:Wallet created!'),
          content: t('Auth:SignUp:Welcome abroad to Terra Station.'),
          button: t('Auth:SignUp:Explore the Terra Network'),
        },
  }
}
