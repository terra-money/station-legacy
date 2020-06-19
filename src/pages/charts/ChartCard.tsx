import React from 'react'
import { ChartDataSets, ChartOptions } from 'chart.js'
import { ChartUI, ChartKey } from '@terra-money/use-station'
import { CumulativeType, AccountType } from '@terra-money/use-station'
import { useChart } from '@terra-money/use-station'
import ErrorBoundary from '../../components/ErrorBoundary'
import ErrorComponent from '../../components/ErrorComponent'
import Chart from '../../components/Chart'
import Card from '../../components/Card'
import Pop from '../../components/Pop'
import Icon from '../../components/Icon'
import Select from '../../components/Select'
import RadioGroup from '../../components/RadioGroup'
import Flex from '../../components/Flex'
import Number from '../../components/Number'

interface ChartProps {
  scales?: ChartOptions['scales']
  lineStyle: ChartDataSets
  fixedYAxis?: boolean
}

const LINE = { backgroundColor: 'rgba(255, 255, 255, 0)' }
const BG = {
  borderColor: 'rgba(32, 67, 181, 0.25)',
  backgroundColor: 'rgba(32, 67, 181, 0.25)',
}

const chartProps: { [key in ChartKey]: ChartProps } = {
  TxVolume: { lineStyle: BG },
  StakingReturn: {
    scales: { yAxes: [{ ticks: { callback: (v) => `${v}%` } }] },
    lineStyle: BG,
    fixedYAxis: true,
  },
  TaxRewards: { lineStyle: LINE },
  TotalAccounts: { lineStyle: LINE },
}

interface Props {
  chartKey: ChartKey
}

const Component = ({ chartKey }: Props) => {
  const { scales, lineStyle, fixedYAxis } = chartProps[chartKey]
  const { filter, value, chart, ...rest } = useChart(chartKey)
  const { type, denom, account, duration } = filter

  /* render */
  const title = (
    <Flex>
      <h1>{rest.title}</h1>
      <Pop type="tooltip" placement="top" width={320} content={rest.desc}>
        {({ ref, getAttrs }) => (
          <Icon
            name="info"
            forwardRef={ref}
            {...getAttrs({ style: { marginLeft: 5 } })}
          />
        )}
      </Pop>
    </Flex>
  )

  const className = 'form-control form-control-md text-capitalize'
  const optionSelectors = (
    <>
      {denom && (
        <Select
          value={denom.value}
          onChange={(e) => denom.set(e.target.value)}
          className={className}
        >
          {denom.options.map((attrs, index) => (
            <option {...attrs} key={index} />
          ))}
        </Select>
      )}

      {account && (
        <Select
          value={account.value}
          onChange={(e) => account.set(e.target.value as AccountType)}
          className={className}
        >
          {account.options.map((attrs, index) => (
            <option {...attrs} key={index} />
          ))}
        </Select>
      )}

      {type && (
        <Select
          value={type.value}
          onChange={(e) => type.set(e.target.value as CumulativeType)}
          className={className}
          style={{ minWidth: 120 }}
        >
          {type.options.map((attrs, index) => (
            <option {...attrs} key={index} />
          ))}
        </Select>
      )}
    </>
  )

  const durationSelector = (
    <RadioGroup
      value={duration.value}
      onChange={duration.set}
      options={duration.options}
    />
  )

  const renderChart = (chart: ChartUI) => {
    const defaultOptions: ChartOptions = {
      scales: {
        xAxes: [{ time: { unit: 'day' } }],
        yAxes: [
          { ticks: { min: fixedYAxis ? 0 : undefined, callback: formatTickY } },
        ],
        ...scales,
      },
      tooltips: {
        callbacks: {
          title: ([{ index }]) => chart.tooltips[index!]['title'],
          label: ({ index }) => chart.tooltips[index!]['label'],
        },
      },
    }

    return (
      <>
        <header style={{ marginBottom: 20 }}>
          <Flex>
            {Array.isArray(value) ? (
              <span style={{ fontSize: 20 }}>
                {value[0]}
                <small>{value[1]}</small>
              </span>
            ) : (
              <Number {...value} fontSize={20} integer />
            )}
          </Flex>
        </header>

        <section style={{ height: 260 }}>
          <Chart
            data={chart.data}
            lineStyle={{
              ...lineStyle,
              lineTension: type?.value === CumulativeType.C ? 0 : undefined,
            }}
            options={defaultOptions}
            height={260}
          />
        </section>
      </>
    )
  }

  return (
    <Card
      title={title}
      actions={optionSelectors}
      footer={durationSelector}
      footerClassName="text-center"
      small
    >
      {chart && renderChart(chart)}
    </Card>
  )
}

const ChartCard = (props: Props) => (
  <ErrorBoundary fallback={<ErrorComponent />}>
    <Component {...props} />
  </ErrorBoundary>
)

export default ChartCard

/* helper */
const B = 1e9
const M = 1e6
const K = 1e3

const formatTickY = (value: number, index: number, values: number[]) => {
  const average = values.reduce((p, n) => p + n, 0) / values.length

  return average > B
    ? value / B + 'B'
    : average > M
    ? value / M + 'M'
    : average > K
    ? value / K + 'K'
    : value
}
