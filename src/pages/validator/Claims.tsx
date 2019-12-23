import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from '../../utils'
import WithRequest from '../../components/WithRequest'
import Pagination from '../../components/Pagination'
import Finder from '../../components/Finder'
import Table from '../../components/Table'
import Coin from '../../components/Coin'
import Icon from '../../components/Icon'
import s from './Claims.module.scss'

interface Claim {
  tx: string
  type: string
  amounts: Coin[]
  timestamp: string
}

type Claims = Pagination & { claims: Claim[] }

const Claims = ({ address }: { address: string }) => {
  const { t } = useTranslation()
  const [page, setPage] = useState<string>('1')

  const renderHead = () => (
    <tr>
      <th>{t('Tx')}</th>
      <th>{t('Type')}</th>
      <th className="text-right">{t('Amount')}</th>
      <th className="text-right">{t('Time')}</th>
    </tr>
  )

  const renderClaim = (claim: Claim, index: number) =>
    claim && (
      <tr key={index}>
        <td>
          <Finder q="tx" v={claim.tx}>
            {format.truncate(claim.tx, [14, 13])}
          </Finder>
        </td>

        <td>{t(claim.type)}</td>

        <td className="text-right">
          {Array.isArray(claim.amounts) && (
            <ul>
              {claim.amounts.map((coin, index) => (
                <li key={index}>
                  <Coin {...coin} />
                </li>
              ))}
            </ul>
          )}
        </td>

        <td className="text-right">{format.date(claim.timestamp)}</td>
      </tr>
    )

  return (
    <WithRequest
      url={`/v1/staking/validators/${address}/claims`}
      params={{ page }}
    >
      {({ claims = [], ...pagination }: Claims) => (
        <Pagination
          {...pagination}
          action={setPage}
          empty={
            <p className={s.empty}>
              <Icon name="info_outline" size={30} />
              {t('This validator has no claim history yet.')}
            </p>
          }
        >
          <Table>
            <thead>{renderHead()}</thead>
            <tbody>{claims.map(renderClaim)}</tbody>
          </Table>
        </Pagination>
      )}
    </WithRequest>
  )
}

export default Claims
