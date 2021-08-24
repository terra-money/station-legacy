import { DelegationsTable, DelegationContent } from '../lib'
import { TableUI } from '../lib'
import { useDelegations } from '../lib'
import ErrorComponent from '../components/ErrorComponent'
import Loading from '../components/Loading'
import More from '../components/More'
import Card from '../components/Card'
import Table from '../components/Table'
import ExtLink from '../components/ExtLink'
import Number from '../components/Number'
import s from './Validator.module.scss'

const Delegations = ({ address }: { address: string }) => {
  const { error, title, ui } = useDelegations(address)

  const renderHeadings = (headings: DelegationsTable['headings']) => {
    const { hash, type, change, date } = headings
    return (
      <tr>
        <th>{hash}</th>
        <th>{type}</th>
        <th className="text-right">{change}</th>
        <th className="text-right">{date}</th>
      </tr>
    )
  }

  const renderRow = ({ link, ...rest }: DelegationContent, index: number) => {
    const { hash, type, display, date } = rest
    return (
      <tr key={index}>
        <td>
          <ExtLink href={link}>{hash}</ExtLink>
        </td>

        <td>{type}</td>

        <td className="text-right">
          <Number>{display.value}</Number>
        </td>

        <td className="text-right">{date}</td>
      </tr>
    )
  }

  const render = ({ card, table, more }: TableUI<DelegationsTable>) => (
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
    <Card title={title} bodyClassName={s.delegation} bordered>
      {error ? <ErrorComponent error={error} /> : ui ? render(ui) : <Loading />}
    </Card>
  )
}

export default Delegations
