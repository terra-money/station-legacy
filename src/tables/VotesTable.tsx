import { VotesTable, VoteContent } from '../lib'
import { PaginationTableUI } from '../lib'
import { useVotes, useVoteOptions } from '../lib'
import { usePageTabs } from '../hooks'
import ErrorComponent from '../components/ErrorComponent'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Card from '../components/Card'
import Table from '../components/Table'
import AccountLink from '../pages/proposal/AccountLink'

const Votes = ({ id, count }: { id: string; count: Dictionary<number> }) => {
  const tabs = useVoteOptions(count)
  const { currentTab, page, renderTabs, getLink } = usePageTabs('option', tabs)
  const { error, ui } = useVotes({ id, option: currentTab, page })

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
          <AccountLink address={voter.address} />
        </td>

        <td>{answer}</td>
      </tr>
    )
  }

  const render = ({
    pagination,
    card,
    table,
  }: PaginationTableUI<VotesTable>) => (
    <Pagination
      {...pagination}
      count={table ? table.contents.length : 0}
      link={getLink}
      empty={card?.content}
    >
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
      {error ? <ErrorComponent error={error} /> : ui ? render(ui) : <Loading />}
    </Card>
  )
}

export default Votes
