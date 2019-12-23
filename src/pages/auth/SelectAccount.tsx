import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { format } from '../../utils'
import Badge from '../../components/Badge'
import Divider from '../../components/Divider'
import s from './SelectAccount.module.scss'

type Item = { bip: number; address: string; bank: Bank }
type Props = { title: string; list: Item[]; onSelect: (index: number) => void }

const bipList = [118, 330]

const SelectAccount = ({ title, list, onSelect }: Props) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<number>(-1)

  const submit: Submit = async e => {
    e.preventDefault()
    onSelect(bipList[selected])
  }

  /* render */
  const renderItem = ({ bip, address, bank }: Item, index: number) => {
    const { vesting, delegations, unbondings } = bank

    type Value = Vesting[] | Delegation[] | Unbonding[]
    const labels: [Value, string][] = [
      [vesting, t('Vested')],
      [delegations, t('Delegated')],
      [unbondings, t('Undelegated')]
    ]

    return (
      <div className={s.item} key={index}>
        <input
          type="radio"
          name="accounts"
          id={address}
          value={address}
          checked={selected === index}
          onChange={e => setSelected(index)}
          hidden
        />
        <label
          htmlFor={address}
          className={c(s.label, selected === index && s.active)}
        >
          <section className={s.meta}>
            <Badge className="badge-secondary">BIP {bip}</Badge>

            {labels.map(
              ([value, label]) =>
                !!value.length && (
                  <Badge className="badge-secondary" key={label}>
                    {label}
                  </Badge>
                )
            )}
          </section>

          <h1>{address}</h1>
          <hr />

          <section className={s.main}>
            {!!bank.balance.length ? (
              <ul className={s.available}>
                {bank.balance.map(({ available, denom }, index) => (
                  <li key={index}>
                    {format.coin({ amount: available, denom })}
                  </li>
                ))}
              </ul>
            ) : (
              t('No balance')
            )}
          </section>
        </label>
      </div>
    )
  }

  return (
    <form onSubmit={submit}>
      <h1>{title}</h1>

      <p className={s.p}>{t('Select address to recover')}</p>
      {list.map(renderItem)}

      <Divider />
      <button
        type="submit"
        className="btn btn-block btn-primary"
        disabled={selected === -1}
      >
        {t('Confirm')}
      </button>
    </form>
  )
}

export default SelectAccount
