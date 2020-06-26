import React from 'react'
import c from 'classnames'
import { SignUpNext, Field, AccountUI } from '@terra-money/use-station'
import { useSelectAccount } from '@terra-money/use-station'
import Form from '../components/Form'
import Badge from '../components/Badge'
import s from './SelectAccount.module.scss'

interface Props {
  field: Field<AccountUI>
  checkedSome: boolean
}

const Account = ({ field, checkedSome }: Props) => {
  const { attrs, setValue, label, ui } = field
  const { bip, badges, balances } = ui!

  return (
    <div className={s.item}>
      <input {...attrs} onChange={() => setValue?.('')} hidden />
      <label
        htmlFor={attrs.id}
        className={c(
          s.label,
          attrs.checked ? s.active : checkedSome && s.muted
        )}
      >
        <section className={s.meta}>
          <Badge className="badge-secondary">BIP {bip}</Badge>

          {badges.map((badge) => (
            <Badge className="badge-secondary" key={badge}>
              {badge}
            </Badge>
          ))}
        </section>

        <h1>{label}</h1>
        <hr />

        <section className={s.main}>
          {Array.isArray(balances) ? (
            <ul className={s.available}>
              {balances.map((balance, index) => (
                <li key={index}>{balance}</li>
              ))}
            </ul>
          ) : (
            balances
          )}
        </section>
      </label>
    </div>
  )
}

const SelectAccount = (props: SignUpNext) => {
  const { form } = useSelectAccount(props)

  return !form ? null : (
    <Form
      form={form}
      renderField={(field) => (
        <Account
          field={field}
          checkedSome={form.fields.some(({ attrs }) => attrs.checked)}
          key={field.label}
        />
      )}
    />
  )
}

export default SelectAccount
