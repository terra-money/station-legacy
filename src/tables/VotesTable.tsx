import React from 'react'
import { Dictionary } from 'ramda'
import { VotesTable, VoteContent } from '../use-station/src'
import { TableUI } from '../use-station/src'
import { useVotes, useVoteOptions } from '../use-station/src'
import { usePageTabs } from '../hooks'
import ErrorComponent from '../components/ErrorComponent'
import Loading from '../components/Loading'
import More from '../components/More'
import Card from '../components/Card'
import Table from '../components/Table'
import Voter from '../pages/proposal/Voter'

const Votes = ({ id, count }: { id: string; count: Dictionary<number> }) => {
  const tabs = useVoteOptions(count)
  const { currentTab, renderTabs } = usePageTabs('option', tabs)
  const { error, ui } = useVotes({ id, option: currentTab })

  const renderHeadings = (headings: VotesTable['headings']) => {
    const { voter, answer } = headings
    return (
      <tr>
        <th>{voter}</th>
        <th>{answer}</th>
      </tr>
    )
  }

  const renderRow = ({ voter, answer }: VoteContent, index: number) => {
    return (
      <tr key={index}>
        <td>
          <Voter voter={voter} />
        </td>

        <td>{answer}</td>
      </tr>
    )
  }

  const render = ({ card, table, more }: TableUI<VotesTable>) => (
    <More empty={card?.content} more={more}>
      {table && (
        <Table>
          <thead>{renderHeadings(table.headings)}</thead>
          <tbody>{table.contents.map(renderRow)}</tbody>
        </Table>
      )}
    </More>
  )

  return (
    <Card title={renderTabs()} bordered fixedHeight>
      {error ? <ErrorComponent error={error} /> : ui ? render(ui) : <Loading />}
    </Card>
  )
}

export default Votes
