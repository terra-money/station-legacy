import { useTranslation } from 'react-i18next'
import { DelegatorsPage, DelegatorsUI, DelegatorsData } from '../../types'
import { format, gt, percent } from '../../utils'
import useFCD from '../../api/useFCD'
import useFinder from '../../hooks/useFinder'

export default (
  address: string,
  { page }: { page?: number }
): DelegatorsPage => {
  const { t } = useTranslation()
  const getLink = useFinder()

  /* api */
  const url = `/v1/staking/validators/${address}/delegators`
  const params = { page: page ?? 1 }
  const response = useFCD<DelegatorsData>({ url, params })

  /* render */
  const render = (data: DelegatorsData): DelegatorsUI => {
    const { page, limit, totalCnt, delegators } = data

    return Object.assign(
      {
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalCnt: Number(totalCnt),
        },
      },
      !delegators || !gt(delegators.length, 0)
        ? {
            card: {
              content: t('Page:Staking:No delegators'),
            },
          }
        : {
            table: {
              headings: {
                address: t('Common:Account:Address'),
                display: t('Common:Tx:Amount'),
                weight: t('Common:Weight'),
              },

              contents: delegators.map(({ address, amount, weight }) => ({
                link: getLink!({ q: 'account', v: address }),
                address,
                display: format.display({ amount, denom: 'uluna' }),
                weight: percent(weight),
              })),
            },
          }
    )
  }

  return Object.assign(
    { title: t('Page:Staking:Delegators') },
    response,
    response.data && { ui: render(response.data) }
  )
}
