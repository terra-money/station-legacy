import React, { useState, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { mergeDeepRight as mergeDeep, path } from 'ramda'
import { ChartOptions, ChartPoint } from 'chart.js'
import { OOPS } from '../../helpers/constants'
import api from '../../api/api'
import { format } from '../../utils'
import Pop from '../../components/Pop'
import Icon from '../../components/Icon'
import Flex from '../../components/Flex'
import Card from '../../components/Card'
import Select from '../../components/Select'
import RadioGroup from '../../components/RadioGroup'
import ErrorBoundary from '../../components/ErrorBoundary'
import Chart, { Props as ChartProps } from '../../components/Chart'

enum CumulativeValues {
  C = 'cumulative',
  P = 'periodic'
}

interface Props {
  url: string
  title: string
  description: string

  cumulativeOptions: {
    initial: boolean
    hide?: boolean
  }

  durationOptions?: {
    initial?: number
    list?: number[]
  }

  additionalOptions?: {
    initial: string
    getList: (results: any) => { value: string; label: string }[]
  }

  fixedYAxis?: boolean

  renderHeader: (
    results: any,
    params: { cumulative: boolean; duration: number; additional?: string }
  ) => ReactNode

  getChartProps: (
    results: any,
    params: { additional?: string }
  ) => Omit<ChartProps, 'height'>
}

const Component = ({ url, title, description, ...props }: Props) => {
  const { cumulativeOptions, durationOptions, additionalOptions } = props
  const { fixedYAxis } = props
  const { renderHeader, getChartProps } = props

  const { t } = useTranslation()

  /* options */
  const durations = durationOptions?.list ?? [0, 7, 14, 30]

  /* state: options */
  const [cumulative, setCumulative] = useState(!!cumulativeOptions?.initial)
  const [duration, setDuration] = useState(durationOptions?.initial ?? 0)
  const [additional, setAdditional] = useState(additionalOptions?.initial)

  /* state: api response */
  const [data, setData] = useState<any>()
  const [, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error>()
  const results = !cumulativeOptions.hide
    ? data?.[cumulative ? CumulativeValues.C : CumulativeValues.P]
    : data

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
  const className = 'form-control form-control-md text-capitalize'
  const additionalList = additionalOptions?.getList(results)
  const actions = (
    <>
      {additionalOptions && (
        <Select
          value={additional}
          onChange={e => setAdditional(e.target.value)}
          className={className}
        >
          {additionalList?.map(({ value, label }, index) => (
            <option value={value} key={index}>
              {label}
            </option>
          ))}
        </Select>
      )}

      {!cumulativeOptions.hide && (
        <Select
          value={cumulative ? CumulativeValues.C : CumulativeValues.P}
          onChange={e =>
            setCumulative(e.target.value === CumulativeValues.C ? true : false)
          }
          className={className}
          style={{ minWidth: 120 }}
        >
          {Object.values(CumulativeValues).map(value => (
            <option value={value} key={value}>
              {t(value)}
            </option>
          ))}
        </Select>
      )}
    </>
  )

  const footer = (
    <RadioGroup
      value={String(duration)}
      onChange={value => setDuration(Number(value))}
      options={durations.map(duration => ({
        value: String(duration),
        label: !duration
          ? t('From genesis')
          : duration === 1
          ? t('Last day')
          : `${duration}${t(' days')}`
      }))}
    />
  )

  const render = () => {
    const { options, lineStyle, ...chartProps } = getChartProps(results, {
      additional
    })

    const defaultOptions: ChartOptions = {
      scales: {
        xAxes: [{ time: { unit: 'day' } }],
        yAxes: [
          { ticks: { min: fixedYAxis ? 0 : undefined, callback: formatTickY } }
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
          {renderHeader(results, { cumulative, duration, additional })}
        </header>

        <section style={{ height: 260 }}>
          <Chart
            {...chartProps}
            lineStyle={{
              ...lineStyle,
              lineTension: cumulative ? 0 : undefined
            }}
            options={mergeDeep(defaultOptions, options || {})}
            height={260}
          />
        </section>
      </>
    )
  }

  const isEmpty = Array.isArray(results) && !results.length
  const iconAttrs = { style: { marginLeft: 5 } }

  return (
    <Card
      title={
        <Flex>
          <h1>{title}</h1>
          <Pop type="tooltip" placement="top" width={320} content={description}>
            {({ ref, getAttrs }) => (
              <Icon name="info" forwardRef={ref} {...getAttrs(iconAttrs)} />
            )}
          </Pop>
        </Flex>
      }
      actions={actions}
      footer={footer}
      footerClassName="text-center"
      small
    >
      {error ? OOPS : results ? (isEmpty ? 'No Data' : render()) : null}
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
