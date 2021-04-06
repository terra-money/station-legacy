import { DelegatorsTable, DelegatorContent } from '../use-station/src'
import { TableUI } from '../use-station/src'
import { useDelegators, format } from '../use-station/src'
import ErrorComponent from '../components/ErrorComponent'
import Loading from '../components/Loading'
import More from '../components/More'
import Card from '../components/Card'
import Table from '../components/Table'
import ExtLink from '../components/ExtLink'
import Number from '../components/Number'
import s from './Validator.module.scss'

const Delegators = ({ address }: { address: string }) => {
  const { error, title, ui } = useDelegators(address)

  const renderHeadings = (headings: DelegatorsTable['headings']) => {
    const { address, display, weight } = headings
    return (
      <tr>
        <th>{address}</th>
        <th className="text-right">{display}</th>
        <th className="text-right">{weight}</th>
      </tr>
    )
  }

  const renderRow = ({ link, ...rest }: DelegatorContent, index: number) => {
    const { address, display, weight } = rest
    return (
      <tr key={index}>
        <td>
          <ExtLink href={link}>{format.truncate(address, [6, 6])}</ExtLink>
        </td>

        <td className="text-right">
          <Number>{display.value}</Number>
        </td>

        <td className="text-right">{weight}</td>
      </tr>
    )
  }

  const render = ({ card, table, more }: TableUI<DelegatorsTable>) => (
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
    <Card title={title} bodyClassName={s.delegator} bordered>
      {error ? <ErrorComponent error={error} /> : ui ? render(ui) : <Loading />}
    </Card>
  )
}

export default Delegators
