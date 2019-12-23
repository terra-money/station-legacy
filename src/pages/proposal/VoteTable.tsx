import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { sum, toNumber } from '../../api/math'
import { format } from '../../utils'
import WithRequest from '../../components/WithRequest'
import Pagination from '../../components/Pagination'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Finder from '../../components/Finder'
import ValidatorLink from './ValidatorLink'

interface VoteItem {
  txhash: string
  answer: string
  voter: SimpleValidator
}

const VoteTable = ({ id, count }: Vote) => {
  const { Yes, No, NoWithVeto, Abstain } = count
  const total = toNumber(sum([Yes, No, NoWithVeto, Abstain]))

  const { t } = useTranslation()
  const [params, setParams] = useState({ page: '1', option: '' })
  const setPage = (page: string) => setParams({ ...params, page })

  const renderTabs = () => (
    <section className="tabs">
      {['', 'Yes', 'No', 'NoWithVeto', 'Abstain'].map(s => (
        <button
          onClick={() => setParams({ page: '1', option: s })}
          className={c('badge', params.option === s && 'badge-primary')}
          key={s}
        >
          {t(s) || t('All votes')}({s ? count[s] : total})
        </button>
      ))}
    </section>
  )

  const renderHead = () => (
    <tr>
      <th>{t('Voter')}</th>
      <th>{t('Answer')}</th>
      <th className="text-right">{t('Tx')}</th>
    </tr>
  )

  const renderVote = ({ voter, answer, txhash }: VoteItem, index: number) => (
    <tr key={index}>
      <td>
        <ValidatorLink {...voter} />
      </td>
      <td>{t(answer)}</td>
      <td className="text-right">
        <Finder q="tx" v={txhash}>
          {format.truncate(txhash, [14, 13])}
        </Finder>
      </td>
    </tr>
  )

  return (
    <Card title={renderTabs()} bordered fixedHeight>
      <WithRequest url={`/v1/gov/proposals/${id}/votes`} params={params}>
        {({ votes, ...pagination }: Pagination & { votes: VoteItem[] }) => (
          <Pagination
            {...pagination}
            action={setPage}
            empty={t('No votes yet.')}
          >
            <Table>
              <thead>{renderHead()}</thead>
              <tbody>{votes.filter(Boolean).map(renderVote)}</tbody>
            </Table>
          </Pagination>
        )}
      </WithRequest>
    </Card>
  )
}

export default VoteTable
