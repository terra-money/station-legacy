import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { path } from 'ramda'
import { useAddress, useUser } from '../../../data/auth'
import { StakingUI, StakingPersonal } from '../../../types'
import { StakingData, StakingPage, StakingDelegation } from '../../../types'
import { ValidatorSorter, Undelegation } from '../../../types'
import { ValidatorListHeadings, ValidatorListHeading } from '../../../types'
import { format } from '../../../utils'
import { sum, plus, minus } from '../../../utils'
import { gte, gt, isFinite, toNumber } from '../../../utils'
import useFCD from '../../../api/useFCD'
import useValidatorItem from './useValidatorItem'

const denom = 'uluna'
export default (initialSort?: { by: string; sort?: string }): StakingPage => {
  const { t } = useTranslation()
  const user = useUser()
  const renderValidatorItem = useValidatorItem()
  const calcUndelegationTotal = (undelegations?: Undelegation[]) =>
    undelegations?.length ? sum(undelegations.map((u) => u.amount)) : '0'

  /* api */
  const address = useAddress()
  const url = address ? `/v1/staking/${address}` : '/v1/staking'
  const response = useFCD<StakingData>({ url })

  /* render */
  const renderPersonal = ({
    rewards,
    ...rest
  }: StakingData): StakingPersonal => {
    const { undelegations, availableLuna, delegationTotal } = rest
    const { myDelegations } = rest
    const myDelegationsFiltered = myDelegations?.filter(({ amountDelegated }) =>
      gte(amountDelegated, 1)
    )

    const undelegationTotal = calcUndelegationTotal(undelegations)

    const getMyDelegationsTable = (title: string, sortKey: SortKey) => {
      const getChart = (d: StakingDelegation) => ({
        label: d.validatorName,
        data: format.amountN(d[sortKey] ?? '0'),
      })

      const sorted = myDelegationsFiltered?.sort(compareWith(sortKey)) ?? []
      const converted = sorted.map(getChart)
      const othersSum = sorted
        .slice(4)
        .reduce((total, d) => plus(total, d[sortKey] ?? '0'), '0')
      const others = { label: 'Others', data: format.amountN(othersSum) }

      const calcSum = (): string => {
        const src = sorted.map((d) => d[sortKey] ?? '0').filter(isFinite)
        return src.length ? sum(src) : '0'
      }

      return !myDelegationsFiltered?.length
        ? undefined
        : {
            title,
            sum: format.display({ amount: calcSum(), denom }),
            table: {
              headings: {
                name: t('Page:Staking:Validator'),
                delegated: `${t('Page:Staking:Delegated')} (Luna)`,
                rewards: `${t('Page:Staking:Rewards')} (Luna)`,
              },
              contents: sorted.map((d) => ({
                address: d.validatorAddress,
                name: d.validatorName,
                delegated: format.display({ amount: d.amountDelegated, denom }),
                rewards: format.display({
                  amount: d.totalReward ?? '0',
                  denom,
                }),
              })),
            },
            chart:
              sorted.length <= 5
                ? converted
                : converted.slice(0, 4).concat(others),
          }
    }

    return {
      withdrawAll: {
        attrs: {
          children: t('Page:Staking:Withdraw all rewards'),
          disabled: !(rewards && gte(rewards.total, 1)),
        },
        amounts: rewards?.denoms.map((coin) => format.display(coin)) ?? [],
        validators:
          myDelegationsFiltered?.map(
            ({ validatorAddress }) => validatorAddress
          ) ?? [],
      },
      available: {
        title: t('Page:Staking:Available for delegation'),
        display: format.display({ amount: availableLuna ?? '0', denom }),
      },
      delegated: {
        title: t('Page:Staking:Delegated assets'),
        display: format.display({ amount: delegationTotal ?? '0', denom }),
      },
      undelegated: {
        title: t('Page:Staking:Undelegated assets'),
        display: format.display({ amount: undelegationTotal ?? '0', denom }),
        table: !undelegations?.length
          ? undefined
          : {
              headings: {
                name: t('Page:Staking:Validator'),
                display: `${t('Common:Tx:Amount')} (Luna)`,
                date: t('Page:Staking:Release time'),
              },
              contents: undelegations.map((u) => ({
                name: u.validatorName,
                display: format.display({ amount: u.amount, denom }),
                date: format.date(u.releaseTime),
              })),
            },
      },
      rewards: {
        title: t('Page:Staking:Rewards'),
        display: format.display({ amount: rewards?.total ?? '0', denom }),
        table: !rewards?.denoms.length
          ? undefined
          : {
              headings: {
                unit: t('Common:Coin'),
                value: t('Common:Tx:Amount'),
              },
              contents: rewards.denoms.map((r) => format.display(r)),
            },
        desc: {
          header: t(
            'Page:Staking:Pro Tip — your rewards will be automatically withdrawn in the following cases'
          ),
          contents: [
            t(
              'Page:Staking:Delegating more to a validator you’ve already delegated to'
            ),
            t('Page:Staking:Undelegation of assets'),
            t('Page:Staking:Redelegation of assets'),
            t('Page:Staking:Mainnet upgrade'),
          ],
          footer: t(
            'Page:Staking:This won’t appear in your transaction history, but your rewards will be reflected in your balance.'
          ),
        },
      },
      myDelegations: getMyDelegationsTable(
        t('Page:Staking:Delegated'),
        'amountDelegated'
      ),
      myRewards: getMyDelegationsTable(
        t('Page:Staking:Rewards'),
        'totalReward'
      ),
    }
  }

  /* validators */
  const headings: ValidatorListHeadings = {
    rank: {
      title: t('Page:Staking:Rank'),
    },
    moniker: {
      title: t('Page:Staking:Moniker'),
      sorter: { prop: 'description.moniker', isString: true },
    },
    votingPower: {
      title: t('Page:Staking:Voting power'),
      sorter: { prop: 'votingPower.weight' },
    },
    selfDelegation: {
      title: t('Page:Staking:Self-delegation'),
      sorter: { prop: 'selfDelegation.weight' },
    },
    commission: {
      title: t('Page:Staking:Validator commission'),
      sorter: { prop: 'commissionInfo.rate' },
    },
    uptime: {
      title: t('Page:Staking:Uptime'),
      sorter: { prop: 'upTime' },
    },
    myDelegation: {
      title: t('Page:Staking:My delegations'),
      sorter: { prop: 'myDelegation' },
    },
  }

  const getInitialSorter = (by: string) => {
    const values: ValidatorListHeading[] = Object.values(headings)
    const sorter = values.find(({ sorter }) => sorter?.prop === by)
    const isString = sorter?.sorter?.isString
    return sorter ? { prop: by, isString } : undefined
  }

  const DefaultSorter: ValidatorSorter = { prop: 'upTime' }
  const initialSorter =
    (initialSort?.['by'] && getInitialSorter(initialSort['by'])) ||
    DefaultSorter
  const initialAsc = initialSort?.['sort'] === 'asc'

  const [sorter, setSorter] = useState<ValidatorSorter>(initialSorter)
  const [asc, setAsc] = useState<boolean>(initialAsc)
  const { prop, isString } = sorter

  const minSortedUptimeDiff = 0.001

  const renderValidators = (staking: StakingData): StakingUI => {
    const { validators, delegationTotal = '0', undelegations } = staking
    const undelegationTotal = calcUndelegationTotal(undelegations)
    const total = plus(delegationTotal, undelegationTotal)

    const sorted = validators
      .filter((v) => {
        const delegated = v.myDelegation && gt(v.myDelegation, 0)
        const hidden = v.status === 'jailed' && !delegated
        return !hidden
      })
      .sort(({ votingPower: a }, { votingPower: b }) =>
        toNumber(minus(b.weight, a.weight))
      )
      .sort((validatorA, validatorB) => {
        const a: string = String(path(prop.split('.'), validatorA) || 0)
        const b: string = String(path(prop.split('.'), validatorB) || 0)
        const c = asc ? 1 : -1
        const compareString = c * (a.toLowerCase() > b.toLowerCase() ? 1 : -1)
        const compareNumber =
          c *
          (Math.abs(toNumber(minus(a, b))) < minSortedUptimeDiff
            ? Math.random() - 0.5
            : gt(a, b)
            ? 1
            : -1)

        return a === b ? 0 : isString ? compareString : compareNumber
      })
      .sort(({ status: a }, { status: b }) => {
        return Number(b === 'active') - Number(a === 'active')
      })

    const grouped = [
      ...sorted
        .filter(({ isNewValidator }) => isNewValidator)
        .map(
          (
            validator // New validators (No rank)
          ) => renderValidatorItem(validator, { index: -1, total })
        ),
      ...sorted
        .filter(({ isNewValidator }) => !isNewValidator)
        .map((validator, index) =>
          renderValidatorItem(validator, { index, total })
        ),
    ]

    return {
      sorter: {
        current: { ...sorter, asc },
        set: (sorter, asc) => {
          setSorter(sorter)
          setAsc(asc)
        },
      },
      headings,
      contents: grouped,
    }
  }

  return Object.assign(
    {},
    response,
    user && response.data && { personal: renderPersonal(response.data) },
    response.data && { ui: renderValidators(response.data) }
  )
}

/* helpers */
type SortKey = keyof StakingDelegation
const compareWith =
  (key: SortKey) => (a: StakingDelegation, b: StakingDelegation) =>
    toNumber(minus(b[key] ?? '0', a[key] ?? '0'))
