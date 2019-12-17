import React, { useState, useEffect, ReactNode } from 'react'
import { mergeDeepRight as mergeDeep, path } from 'ramda'
import { ChartOptions, ChartPoint } from 'chart.js'
import { OOPS } from '../../helpers/constants'
import api from '../../api/api'
import { format } from '../../utils'
import Card from '../../components/Card'
import Select from '../../components/Select'
import ErrorBoundary from '../../components/ErrorBoundary'
import Chart, { Props as ChartProps } from '../../components/Chart'

interface Props {
  url: string
  title: string
  initialAdditionalIndex?: number
  durations?: number[]
  initialDuration?: number
  variableY?: boolean
  additionalSelector?: (data: any) => string[]
  renderHeader: (
    data: any,
    params: { additionalIndex: number; duration: number }
  ) => ReactNode
  getChartProps: (
    data: any,
    additionalIndex: number
  ) => Omit<ChartProps, 'height'>
}

const Component = ({ url, title, ...props }: Props) => {
  const { initialAdditionalIndex = 0, additionalSelector } = props
  const { renderHeader, getChartProps, variableY } = props
  const { durations = [0, 7, 14, 30], initialDuration = 0 } = props

  /* form */
  type Values = { duration: number; additionalIndex: number }
  const InitialValues = {
    duration: initialDuration,
    additionalIndex: initialAdditionalIndex
  }
  const [values, setValues] = useState<Values>(InitialValues)
  const { duration, additionalIndex } = values

  /* api response */
  const [data, setData] = useState<any>()
  const [, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error>()
  const additional = additionalSelector && data ? additionalSelector(data) : []

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: Number(value) })
  }

  /* Fetch data */
  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true)
      setError(undefined)

      try {
        const count = duration === 1 ? 3 : duration
        const params = Object.assign({}, duration > 0 && { count })
        const { data } = await api.get<any>(url, { params })
        setData(data)
      } catch (error) {
        setError(error)
      }

      setIsLoading(false)
    }

    fetchPrices()
    // eslint-disable-next-line
  }, [duration])

  /* render */
  const select = {
    onChange: handleChange,
    className: 'form-control form-control-md'
  }

  const renderActions = () => (
    <>
      {additionalSelector && !!additional.length && (
        <Select name="additionalIndex" value={additionalIndex} {...select}>
          {additional.map((label, index) => (
            <option value={index} key={index}>
              {label}
            </option>
          ))}
        </Select>
      )}

      <Select
        name="duration"
        value={duration}
        style={{ minWidth: 120 }}
        {...select}
      >
        {durations.map(duration => (
          <option value={duration} key={duration}>
            {!duration
              ? 'From genesis'
              : duration === 1
              ? 'Last day'
              : `${duration} days`}
          </option>
        ))}
      </Select>
    </>
  )

  const render = () => {
    const { options, ...chartProps } = getChartProps(data, additionalIndex)
    const defaultOptions: ChartOptions = {
      scales: {
        xAxes: [{ time: { unit: 'day' } }],
        yAxes: [
          { ticks: { min: variableY ? undefined : 0, callback: formatTickY } }
        ]
      },
      tooltips: {
        callbacks: {
          label: ({ index }, { datasets }) => {
            const point: ChartPoint =
              (typeof index === 'number' &&
                path([0, 'data', index], datasets)) ||
              {}
            return point.t ? format.date(point.t as Date, { short: true }) : ''
          }
        }
      }
    }

    return (
      <>
        <header style={{ marginBottom: 20 }}>
          {renderHeader(data, { additionalIndex, duration })}
        </header>

        <section style={{ height: 260 }}>
          <Chart
            {...chartProps}
            options={mergeDeep(defaultOptions, options || {})}
            height={260}
          />
        </section>
      </>
    )
  }

  const isEmpty = Array.isArray(data) && !data.length

  return (
    <Card title={title} actions={renderActions()} small>
      {error ? OOPS : data ? (isEmpty ? 'No Data' : render()) : null}
    </Card>
  )
}

const ChartCard = (props: Props) => {
  const fallback = (
    <Card title={props.title} small>
      {OOPS}
    </Card>
  )

  return (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
}

export default ChartCard

/* helper */
const formatTickY = (value: number, index: number, values: number[]) => {
  const average = values.reduce((p, n) => p + n, 0) / values.length

  return average > 1000000000
    ? value / 1000000000 + 'B'
    : average > 1000000
    ? value / 1000000 + 'M'
    : average > 1000
    ? value / 1000 + 'K'
    : value
}
