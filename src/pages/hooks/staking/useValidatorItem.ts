import { useTranslation } from 'react-i18next'
import { ValidatorUI, ValidatorData, MyActionContent } from '../../../types'
import { format, div, sum, percent, gte } from '../../../utils'
import useFinder from '../../../hooks/useFinder'

interface Params {
  index: number
  total: string
}

const denom = 'uluna'
export default (): ((v: ValidatorData, params?: Params) => ValidatorUI) => {
  const { t } = useTranslation()
  const getLink = useFinder()

  return (v, params): ValidatorUI => {
    const { index, total } = params || {}

    const { description, status, operatorAddress, accountAddress } = v
    const { votingPower, selfDelegation } = v
    const { commissionInfo, upTime } = v
    const { myDelegation, myUndelegation: myUndelegations, myRewards } = v

    const myUndelegation = myUndelegations?.length
      ? sum(myUndelegations.map((u) => u.amount))
      : undefined

    return {
      rank: typeof index === 'number' ? index + 1 : undefined,

      moniker: description.moniker,
      profile: description.profileIcon,
      details: description.details,
      status: status,
      link: description.website,

      operatorAddress: {
        title: t('Page:Staking:Operator address'),
        address: operatorAddress,
      },
      accountAddress: {
        title: t('Page:Staking:Account address'),
        address: accountAddress,
        link: getLink?.({ q: 'account', v: accountAddress }),
      },

      votingPower: {
        title: t('Page:Staking:Voting power'),
        percent: percent(votingPower.weight),
        display: format.display({ amount: votingPower.amount, denom }),
      },
      selfDelegation: {
        title: t('Page:Staking:Self-delegation'),
        percent: selfDelegation && percent(selfDelegation.weight),
        display:
          selfDelegation &&
          format.display({ amount: selfDelegation.amount, denom }),
      },
      commission: {
        title: t('Page:Staking:Commission'),
        percent: percent(commissionInfo.rate, 1),
      },
      maxRate: {
        title: t('Page:Staking:Max commission rate'),
        percent: percent(commissionInfo.maxRate),
      },
      maxChangeRate: {
        title: t('Page:Staking:Max daily commission change'),
        percent: percent(commissionInfo.maxChangeRate),
      },
      updateTime: {
        title: t('Page:Staking:Last commission change'),
        date: format.date(commissionInfo.updateTime),
      },
      uptime: {
        title: t('Page:Staking:Uptime'),
        desc: t('Page:Staking:Last 10k blocks'),
        percent: percent(upTime, 0),
      },

      myDelegations: Object.assign(
        { title: t('Page:Staking:My delegations') },
        myDelegation && {
          display: format.display({ amount: myDelegation, denom }),
          percent: total && percent(div(myDelegation, total), 0),
        }
      ),
      myUndelegations: Object.assign(
        { title: '' },
        myUndelegation && {
          display: format.display({ amount: myUndelegation, denom }),
          percent: total && percent(div(myUndelegation, total), 0),
        }
      ),
      myRewards: Object.assign(
        { title: t('Page:Staking:My rewards') },
        myRewards && {
          display: format.display({ amount: myRewards.total, denom }),
          amounts: myRewards.denoms.map((reward) => format.display(reward)),
        }
      ),
      myActionsTable: !(myDelegation || myUndelegations?.length)
        ? undefined
        : {
            headings: {
              action: t('Page:Staking:Action'),
              display: `${t('Common:Tx:Amount')} (Luna)`,
              date: t('Page:Staking:Release time'),
            },
            contents: ([] as MyActionContent[])
              .concat(
                myDelegation
                  ? {
                      action: t('Page:Staking:Delegated'),
                      display: format.display({ amount: myDelegation, denom }),
                      date: '-',
                    }
                  : []
              )
              .concat(
                myUndelegations?.length
                  ? myUndelegations.map((u) => ({
                      action: t('Page:Staking:Undelegated'),
                      display: format.display({ amount: u.amount, denom }),
                      date: format.date(u.releaseTime),
                    }))
                  : []
              ),
          },

      /* buttons */
      delegate: {
        children: t('Post:Staking:Delegate'),
        disabled: status === 'jailed',
      },
      redelegate: {
        children: 'Redelegate',
        disabled: status === 'jailed',
      },
      undelegate: {
        children: t('Post:Staking:Undelegate'),
        disabled: !myDelegation,
      },
      withdraw: {
        children: t('Post:Staking:Withdraw'),
        disabled: !(myRewards && gte(myRewards.total, 1)),
      },
    }
  }
}
