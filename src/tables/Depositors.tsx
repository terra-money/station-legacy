import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from '../lib'
import { toStationCoin } from '../utils/format'
import { useDeposits, useProposalId } from '../data/lcd/gov'
import ErrorComponent from '../components/ErrorComponent'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Card from '../components/Card'
import Table from '../components/Table'
import Displays from '../components/Displays'
import AccountLink from '../pages/proposal/AccountLink'

const LIMIT = 5

const Depositors = () => {
  const { t } = useTranslation()
  const id = useProposalId()
  const [page, setPage] = useState(1)
  const { data: deposits, error } = useDeposits(id)

  if (error) return <ErrorComponent error={error as Error} />
  if (!deposits) return <Loading />

  const sliced = deposits.slice(5 * (page - 1), 5 * page)

  return (
    <Card title={t('Page:Governance:Depositors')} bordered fixedHeight>
      <Pagination
        page={page}
        limit={LIMIT}
        totalCnt={deposits.length}
        count={sliced.length}
        action={setPage}
        empty={
          !deposits.length ? t('Page:Governance:No deposits yet') : undefined
        }
      >
        <Table>
          <thead>
            <tr>
              <th>{t('Page:Governance:Depositor')}</th>
              <th>{t('Common:Tx:Amount')}</th>
            </tr>
          </thead>

          <tbody>
            {sliced.map(({ depositor, amount }, index) => {
              return (
                <tr key={index}>
                  <td>
                    <AccountLink address={depositor} />
                  </td>

                  <td>
                    <Displays
                      list={amount.map((coin) =>
                        format.display(toStationCoin(coin))
                      )}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Pagination>
    </Card>
  )
}

export default Depositors
