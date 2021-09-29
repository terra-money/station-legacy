import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, Vesting, Delegation, Unbonding } from '../../types'
import { SignUpNext, SelectAccount, Bip } from '../../types'
import { Account } from '../../types'
import { format } from '../../utils'

export default ({ accounts, signUp }: SignUpNext): SelectAccount => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<Bip>()

  const fields = accounts?.map(({ bip, address, bank }: Account): Field => {
    const badges: [string, (Vesting | Delegation | Unbonding)[]][] = [
      [t('Auth:SignUp:Vested'), bank.vesting],
      [t('Auth:SignUp:Delegated'), bank.delegations],
      [t('Auth:SignUp:Undelegated'), bank.unbondings],
    ]

    return {
      label: address,
      element: 'input',
      attrs: {
        type: 'radio',
        name: 'account',
        id: address,
        checked: selected === bip,
      },
      setValue: () => setSelected(bip),
      ui: {
        bip,
        badges: badges
          .filter(([, value]) => value.length)
          .map(([label]) => label),
        balances: bank.balance.length
          ? bank.balance.map(({ available, denom }) =>
              format.coin({ amount: available, denom })
            )
          : t('Auth:SignUp:No balance'),
      },
    }
  })

  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async () => {
    await signUp(selected)
    setSubmitted(true)
  }

  const disabled = !selected

  const form = fields && {
    title: t('Auth:SignUp:Select address to recover'),
    fields,
    disabled,
    submitLabel: t('Common:Form:Confirm'),
    onSubmit: disabled ? undefined : onSubmit,
  }

  const card = {
    title: t('Auth:SignUp:Wallet recovered successfully!'),
    content: t('Auth:SignUp:Welcome back to Terra Station.'),
    button: t('Auth:SignUp:Explore the Terra Network'),
  }

  return {
    form: !accounts ? undefined : form,
    result: !submitted ? undefined : card,
  }
}
