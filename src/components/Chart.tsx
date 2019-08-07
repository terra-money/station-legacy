import React, { useRef, useEffect, useState } from 'react'
import ChartJS, { helpers } from 'chart.js'
import { ChartConfiguration, ChartDataSets, ChartData } from 'chart.js'
import { ChartTooltipItem, ChartPoint } from 'chart.js'
import { format } from '../utils'

type ChartType = 'doughnut' | 'line'
type Props = {
  type: ChartType
  labels?: string[]
  data: number[] | ChartPoint[]
  width?: number
  height: number
}

const Chart = ({ type, labels, data, height, ...props }: Props) => {
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
  }, [width])

  /* Init chart */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chart, setChart] = useState<ChartJS>()
  useEffect(() => {
    const initChart = (ctx: CanvasRenderingContext2D) => {
      ctx.canvas.width = width
      ctx.canvas.height = height
      const chart = new ChartJS(ctx, getOptions(type))
      setChart(chart)
    }

    const canvas = canvasRef.current
    const ctx = canvas && canvas.getContext('2d')
    width && ctx && initChart(ctx)
  }, [width, height, type])

  /* Update chart */
  useEffect(() => {
    const updateChart = (chart: ChartJS) => {
      labels && (chart.data.labels = labels)
      chart.data.datasets && (chart.data.datasets[0].data = data)
      chart.update()
    }

    chart && updateChart(chart)
  }, [chart, labels, data])

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Chart

/* Chart.js */
const BLUE = '#2043b5'
const getOptions = (type: ChartType): ChartConfiguration => {
  /* Dataset Properties */
  const defaultProps = {
    borderWidth: 1
  }

  const props = {
    doughnut: {
      backgroundColor: ['#6292ec', '#5152f3', '#a757f4', '#f19f4d', '#ce4a6f']
    },
    line: {
      backgroundColor: helpers
        .color('#e4e8f6')
        .alpha(0.5)
        .rgbString(),
      borderColor: BLUE,
      pointBackgroundColor: BLUE,
      pointRadius: 0,
      pointHoverRadius: 0
    }
  }[type]

  /* Options */
  const defaultOptions = {
    responsive: true,
    animation: { duration: 0 },
    legend: { display: false },
    tooltips: { displayColors: false }
  }

  const options = {
    doughnut: {
      aspectRatio: 1,
      cutoutPercentage: 85
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
          title: ([{ value }]: ChartTooltipItem[]) => value,
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
type Data = (number | null | undefined | ChartPoint)[]
const getLabel = ({ index }: ChartTooltipItem, { datasets }: ChartData) => {
  const getDataset = ([dataset]: ChartDataSets[]) => dataset
  const getData = ({ data }: ChartDataSets) => data
  const getChartPoint = (data: Data, index: number) => data[index]
  const getPoint = ({ t }: ChartPoint) => t

  const dataset = datasets && getDataset(datasets)
  const data = dataset && getData(dataset)
  const point = data && typeof index === 'number' && getChartPoint(data, index)
  const t = point && typeof point !== 'number' && getPoint(point)

  return t instanceof Date ? format.date(t) : ''
}
