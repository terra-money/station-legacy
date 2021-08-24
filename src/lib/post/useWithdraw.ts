import { MsgWithdrawDelegationReward } from '@terra-money/terra.js'
import { useTranslation } from 'react-i18next'
import { User, WithdrawProps, PostPage } from '../types'
import useBank from '../api/useBank'
import { isFeeAvailable, getFeeDenomList } from './validateConfirm'

export default (user: User, props: WithdrawProps): PostPage => {
  const { amounts, validators } = props
  const { t } = useTranslation()
  const { data: bank, loading, error } = useBank(user)
  const { address: to } = user

  const msgs = validators?.map(
    (addr) => new MsgWithdrawDelegationReward(to, addr)
  )

  return {
    error,
    loading,
    submitted: true,
    confirm: bank && {
      msgs,
      contents: [{ name: t('Common:Tx:Amount'), displays: amounts }],
      feeDenom: { list: getFeeDenomList(bank.balance) },
      validate: (fee) => isFeeAvailable(fee, bank.balance),
      submitLabels: [
        t('Post:Staking:Withdraw'),
        t('Post:Staking:Withdrawing...'),
      ],
      message: t('Post:Staking:Withdrew to {{to}}', { to }),
    },
  }
}
