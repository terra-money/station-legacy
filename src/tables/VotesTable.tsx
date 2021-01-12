import React from 'react'
import { Dictionary } from 'ramda'
import { VotesTable, VoteContent } from '../use-station/src'
import { TableUI } from '../use-station/src'
import { useVotes, useVoteOptions, format } from '../use-station/src'
import { useTabs } from '../hooks'
import ErrorComponent from '../components/ErrorComponent'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Card from '../components/Card'
import Table from '../components/Table'
import ExtLink from '../components/ExtLink'
import Voter from '../pages/proposal/Voter'

const Votes = ({ id, count }: { id: string; count: Dictionary<number> }) => {
  const tabs = useVoteOptions(count)
  const { currentTab, page, renderTabs, getLink } = useTabs('option', tabs)
  const { error, ui } = useVotes({ id, option: currentTab, page })

  const renderHeadings = (headings: VotesTable['headings']) => {
    const { voter, answer, hash } = headings
    return (
      <tr>
        <th>{voter}</th>
        <th>{answer}</th>
        <th className="text-right">{hash}</th>
      </tr>
    )
  }

  const renderRow = ({ voter, answer, hash }: VoteContent, index: number) => {
    return (
      <tr key={index}>
        <td>
          <Voter voter={voter} />
        </td>

        <td>{answer}</td>

        <td className="text-right">
          <ExtLink href={hash.link}>
            {format.truncate(hash.text, [14, 13])}
          </ExtLink>
        </td>
      </tr>
    )
  }

  const render = ({ pagination, card, table }: TableUI<VotesTable>) => (
    <Pagination {...pagination} link={getLink} empty={card?.content}>
      {table && (
        <Table>
          <thead>{renderHeadings(table.headings)}</thead>
          <tbody>{table.contents.map(renderRow)}</tbody>
        </Table>
      )}
    </Pagination>
  )

  return (
    <Card title={renderTabs()} bordered fixedHeight>
      {error ? <ErrorComponent /> : ui ? render(ui) : <Loading />}
    </Card>
  )
}

export default Votes
