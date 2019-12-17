import React, { useRef, useEffect, useState } from 'react'
import { mergeDeepRight as mergeDeep, path } from 'ramda'
import debounce from 'lodash/fp/debounce'
import ChartJS from 'chart.js'
import { times } from '../api/math'
import { format } from '../utils'

type ChartType = 'doughnut' | 'line' | 'pie'
export type Props = {
  type: ChartType
  pieBackgroundColors?: string[]
  lineStyle?: ChartJS.ChartDataSets
  labels?: string[]
  data: number[] | ChartJS.ChartPoint[]
  options?: ChartJS.ChartOptions
  width?: number
  height: number
}

const ChartComponent = (props: Props) => {
  const { type, labels, data, height, options } = props
  const { pieBackgroundColors, lineStyle } = props

  /* DOM Size */
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(props.width || 0)
  useEffect(() => {
    const getWidth = (container: HTMLDivElement) => {
      const { width } = container.getBoundingClientRect()
      setWidth(width)
    }

    const container = containerRef.current
    !width && container && getWidth(container)
    // eslint-disable-next-line
  }, [])

  /* Init chart */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chart, setChart] = useState<ChartJS>()
  useEffect(() => {
    const initChart = (ctx: CanvasRenderingContext2D) => {
      ctx.canvas.width = width
      ctx.canvas.height = height
      const chart = new ChartJS(
        ctx,
        getOptions(type, { pieBackgroundColors, lineStyle })
      )
      setChart(chart)
    }

    const canvas = canvasRef.current
    const ctx = canvas && canvas.getContext('2d')
    width && ctx && initChart(ctx)
    // eslint-disable-next-line
  }, [width])

  /* Update chart */
  useEffect(() => {
    const updateChart = (chart: ChartJS) => {
      const merge = (options: ChartJS.ChartOptions) => {
        const getAxe = (axis: string) =>
          path<object>(['scales', `${axis}Axes`, 0])

        const scales = {
          xAxes: [
            mergeDeep(
              getAxe('x')(chart.options) || {},
              getAxe('x')(options) || {}
            )
          ],
          yAxes: [
            mergeDeep(
              getAxe('y')(chart.options) || {},
              getAxe('y')(options) || {}
            )
          ]
        }

        chart.options = mergeDeep(
          chart.options,
          Object.assign({}, options, options.scales && { scales })
        )
      }

      const { datasets } = chart.data
      labels && (chart.data.labels = labels)
      datasets && (datasets[0].data = data)
      options && merge(options)
      lineStyle && datasets && (datasets[0] = { ...datasets[0], ...lineStyle })

      chart.update()
    }

    chart && updateChart(chart)
  }, [chart, labels, data, options, lineStyle])

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  )
}

const Chart = (props: Props) => {
  const [key, setKey] = useState<number>(0)
  useEffect(() => {
    const refresh = debounce(300)(() => setKey(k => k + 1))
    window.addEventListener('resize', refresh)
    return () => window.removeEventListener('resize', refresh)
  }, [])

  return <ChartComponent {...props} key={key} />
}

export default Chart

/* Chart.js */
const BLUE = '#2043b5'
const getOptions = (
  type: ChartType,
  config: {
    pieBackgroundColors?: string[]
    lineStyle?: ChartJS.ChartDataSets
  }
): ChartJS.ChartConfiguration => {
  /* Dataset Properties */
  const defaultProps = {
    borderWidth: 1
  }

  const props = {
    doughnut: {
      backgroundColor: ['#6292ec', '#5152f3', '#a757f4', '#f19f4d', '#ce4a6f']
    },
    pie: {
      backgroundColor: config.pieBackgroundColors
    },
    line: {
      borderColor: BLUE,
      pointBackgroundColor: BLUE,
      pointRadius: 0,
      pointHoverRadius: 0,
      ...config.lineStyle
    }
  }[type]

  /* Options */
  const defaultOptions = {
    responsive: true,
    animation: { duration: 0 },
    legend: { display: false }
  }

  const tooltips = {
    backgroundColor: BLUE,
    titleFontFamily: 'Gotham',
    titleFontSize: 13,
    titleFontStyle: 700,
    titleMarginBottom: 4,
    bodyFontFamily: 'Gotham',
    bodyFontSize: 13,
    bodyFontStyle: 'normal',
    xPadding: 15,
    yPadding: 10,
    caretSize: 6,
    displayColors: false,
    callbacks: {
      title: (
        [{ index }]: ChartJS.ChartTooltipItem[],
        { labels }: ChartJS.ChartData
      ) => labels && typeof index === 'number' && labels[index],
      label: getLabel
    }
  }

  const options = {
    doughnut: {
      aspectRatio: 1,
      cutoutPercentage: 85,
      tooltips
    },
    pie: {
      aspectRatio: 1,
      cutoutPercentage: 0,
      tooltips
    },
    line: {
      tooltips: {
        mode: 'index',
        intersect: false,
        backgroundColor: BLUE,
        titleFontFamily: 'Gotham',
        titleFontSize: 16,
        titleFontStyle: 500,
        titleMarginBottom: 2,
        bodyFontFamily: 'Gotham',
        bodyFontSize: 11,
        bodyFontStyle: 'normal',
        xPadding: 15,
        yPadding: 10,
        caretSize: 6,
        displayColors: false,
        callbacks: {
          title: ([{ value }]: ChartJS.ChartTooltipItem[]) => value,
          label: getLabel
        }
      },
      scales: {
        xAxes: [
          {
            type: 'time',
            ticks: {
              source: 'data',
              autoSkip: true,
              fontColor: '#7282c9',
              fontSize: 11
            },
            gridLines: { color: '#f0f0f0' }
          }
        ],
        yAxes: [
          {
            ticks: { fontColor: '#7282c9', fontSize: 11 },
            gridLines: { color: '#f0f0f0' }
          }
        ]
      }
    }
  }[type]

  return {
    type,
    data: { datasets: [{ ...defaultProps, ...props }] },
    options: Object.assign({}, defaultOptions, options)
  }
}

/* callbacks */
const getLabel = (
  { index }: ChartJS.ChartTooltipItem,
  { datasets }: ChartJS.ChartData
) => {
  type Point = ChartJS.ChartPoint | number
  const point: Point =
    (typeof index === 'number' && path([0, 'data', index], datasets)) || 0
  const t = point && typeof point !== 'number' ? point.t : point
  return t instanceof Date
    ? format.date(t)
    : t
    ? format.amount(times(t, 1e6))
    : ''
}
