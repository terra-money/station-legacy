import React, { useState } from 'react'
import c from 'classnames'
import { sum, toNumber } from '../../api/math'
import { format } from '../../utils'
import WithRequest from '../../components/WithRequest'
import Pagination from '../../components/Pagination'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Finder from '../../components/Finder'

interface VoteItem {
  txhash: string
  answer: string
  voter: string
}

const VoteTable = ({ id, count }: Vote) => {
  const { Yes, No, NoWithVeto, Abstain } = count
  const total = toNumber(sum([Yes, No, NoWithVeto, Abstain]))

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
          {s || 'All votes'}({s ? count[s] : total})
        </button>
      ))}
    </section>
  )

  const renderHead = () => (
    <tr>
      <th>Voter</th>
      <th>Answer</th>
      <th className="text-right">Tx</th>
    </tr>
  )

  const renderVote = (vote: VoteItem, index: number) =>
    vote && (
      <tr key={index}>
        <td>
          <Finder q="account" v={vote.voter}>
            {format.truncate(vote.voter, [7, 6])}
          </Finder>
        </td>
        <td>{vote.answer}</td>
        <td className="text-right">
          <Finder q="tx" v={vote.txhash}>
            {format.truncate(vote.txhash, [14, 13])}
          </Finder>
        </td>
      </tr>
    )

  return (
    <Card title={renderTabs()} bordered fixedHeight>
      <WithRequest url={`/v1/gov/proposals/${id}/votes`} params={params}>
        {({ votes, ...pagination }: Pagination & { votes: VoteItem[] }) => (
          <Pagination {...pagination} action={setPage} empty="No votes yet.">
            <Table>
              <thead>{renderHead()}</thead>
              <tbody>{votes.map(renderVote)}</tbody>
            </Table>
          </Pagination>
        )}
      </WithRequest>
    </Card>
  )
}

export default VoteTable
