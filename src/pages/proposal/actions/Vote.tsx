import React, { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { useForm, useAuth } from '../../../hooks'
import Divider from '../../../components/Divider'
import ModalContent from '../../../components/ModalContent'
import Confirmation from '../../Confirmation'
import s from './Vote.module.scss'

interface Props {
  id: string
  onSubmitting: (b: boolean) => void
  onSubmit: () => void
}

interface Values {
  option: string
}

const OptionsList = [
  { key: 'yes', label: 'Yes', className: s.yes },
  { key: 'no', label: 'No', className: s.no },
  { key: 'no_with_veto', label: 'No\nWithVeto', className: s.veto },
  { key: 'abstain', label: 'Abstain', className: s.abstain }
]

const Vote = ({ id, onSubmitting, onSubmit }: Props) => {
  const { t } = useTranslation()
  const { address } = useAuth()

  /* validation */
  const validate = ({ option }: Values) => ({
    option: !option ? t('Option is required') : ''
  })

  /* state: form */
  const form = useForm<Values>({ initial: { option: '' }, validate })
  const { values, handleChange, invalid } = form
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { option } = values

  /* submit: tx */
  const submit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  /* isSubmitting */
  const handleSubmitting = (b: boolean) => {
    onSubmitting(b)
    setIsSubmitting(b)
  }

  return (
    <ModalContent
      close={onSubmit}
      goBack={isSubmitted ? () => setIsSubmitted(false) : undefined}
      disabled={isSubmitting}
    >
      {!isSubmitted ? (
        <form onSubmit={submit}>
          <h1>{t('Vote')}</h1>

          <section className={s.options}>
            {OptionsList.map(({ key, label, className }) => {
              const checked = option === key
              return (
                <div className={s.option} key={key}>
                  <input
                    type="radio"
                    name="option"
                    id={key}
                    value={key}
                    checked={checked}
                    onChange={handleChange}
                    hidden
                  />
                  <label
                    htmlFor={key}
                    className={c(s.label, className, checked && s.checked)}
                  >
                    {t(label)}
                  </label>
                </div>
              )
            })}
          </section>

          <Divider />
          <button
            type="submit"
            disabled={invalid}
            className="btn btn-block btn-primary"
          >
            {t('Next')}
          </button>
        </form>
      ) : (
        <Confirmation
          url={`/gov/proposals/${id}/votes`}
          payload={{ voter: address, option }}
          label={['Vote', 'Voting']}
          message={`Voted ${option} for proposal ${id}`}
          onSubmitting={handleSubmitting}
          onFinish={onSubmit}
        />
      )}
    </ModalContent>
  )
}

export default Vote
