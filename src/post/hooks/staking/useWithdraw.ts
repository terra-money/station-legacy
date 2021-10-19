import { MsgWithdrawDelegatorReward } from '@terra-money/terra.js'
import { useTranslation } from 'react-i18next'
import { WithdrawProps, PostPage } from '../../../types'
import { useAddress } from '../../../data/auth'
import useBank from '../../../api/useBank'
import { isFeeAvailable, getFeeDenomList } from '../validateConfirm'

export default (props: WithdrawProps): PostPage => {
  const { amounts, validators } = props
  const { t } = useTranslation()
  const { data: bank, loading, error } = useBank()
  const to = useAddress()

  const msgs = validators?.map(
    (addr) => new MsgWithdrawDelegatorReward(to, addr)
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
