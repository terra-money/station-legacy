import React, { useState, ChangeEvent, ReactNode } from 'react'
import { format } from '../../utils'
import WithRequest from '../../components/WithRequest'
import Table from '../../components/Table'
import Card from '../../components/Card'
import Select from '../../components/Select'
import NotAvailable from './NotAvailable'
import variation from './Variation'

const RateList = ({ denoms }: { denoms: string[] }) => {
  const [denom, setDenom] = useState('uluna')
  const handleChange = (e: ChangeEvent<HTMLFieldElement>) =>
    setDenom(e.target.value)

  return (
    <Card
      title="Swap rate"
      actions={
        <Select
          name="denom"
          value={denom}
          onChange={handleChange}
          className="form-control form-control-md"
        >
          {denoms.map((denom, index) => (
            <option value={denom} key={index}>
              {format.denom(denom)}
            </option>
          ))}
        </Select>
      }
    >
      <WithRequest url={`/v1/market/swaprate/${denom}`}>
        {(rateList: RateList) =>
          !!rateList.length ? (
            <Table>
              <thead>
                <tr>
                  <th />
                  <th colSpan={2} className="text-right">
                    24h Change
                  </th>
                </tr>
              </thead>

              <tbody>
                {rateList.map((r, index) => {
                  const renderCells = ([h, t]: ReactNode[]): ReactNode => (
                    <>
                      <td>{h}</td>
                      <td className="text-right">{t}</td>
                    </>
                  )

                  return (
                    <tr key={index}>
                      <td>
                        {format.decimal(r.swaprate)}{' '}
                        <strong>{format.denom(r.denom)}</strong>
                      </td>

                      {variation({ ...r, render: renderCells })}
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          ) : (
            <NotAvailable q="Swapping" />
          )
        }
      </WithRequest>
    </Card>
  )
}

export default RateList
