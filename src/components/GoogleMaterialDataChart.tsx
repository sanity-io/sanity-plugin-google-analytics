import React, {useCallback} from 'react'
import {Chart} from 'react-google-charts'
import type {
  ChartWrapperOptions,
  GoogleChartWrapper,
  GoogleChartWrapperChartType,
  ReactGoogleChartEvent,
} from 'react-google-charts/dist/types'
import {RouterContextValue, useRouter} from 'sanity/router'

import {useGoogleAnalyticsReportData} from '../contexts/GoogleAnalyticsReportContext'
import css from './GoogleMaterialDataChart.css'
import Loading from './Loading'

type GoogleChartWrapperChart = ReturnType<GoogleChartWrapper['getChart']>
type GoogleChartWrapperSelectedItem = ReturnType<GoogleChartWrapper['getSelection']>[number]

export type ChartSelectionCallback = (
  selectedItem: GoogleChartWrapperSelectedItem,
  cell: any,
  chart: GoogleChartWrapperChart,
  router: RouterContextValue
) => {}

export interface GoogleMaterialDataChartProps {
  chart: ChartWrapperOptions['options'] & {
    type: GoogleChartWrapperChartType
    labels?: {[key: string]: string}
  }
  mapsApiKey?: string
  onSelect?: ChartSelectionCallback
}

export default function GoogleMaterialDataChart(props: GoogleMaterialDataChartProps) {
  const {data, isLoaded} = useGoogleAnalyticsReportData()
  const {mapsApiKey, chart, onSelect} = props
  const router = useRouter()

  const handleSelect = useCallback<ReactGoogleChartEvent['callback']>(
    ({chartWrapper}) => {
      if (!onSelect) {
        return
      }

      const dataChart = chartWrapper.getChart()
      const selection = dataChart.getSelection()

      if (selection.length !== 1) {
        return
      }

      const [selectedItem] = selection
      const {row, column} = selectedItem

      let cell
      if (typeof row === 'number' && typeof column === 'number') {
        cell = data.rows[row].c[column].v
      } else if (typeof row === 'number' && typeof column !== 'number') {
        cell = data.rows[row]
      }

      onSelect(selectedItem, cell, dataChart, router)
    },
    [data, onSelect, router]
  )

  if (!isLoaded || !data) {
    return <Loading message="Loading data" />
  }

  const {type, ...chartOptions} = chart

  if (type === 'PieChart') {
    return <div>Pie is not supported yet</div>
  }

  // Add custom labels from config to the dataTable
  if (type === 'Table') {
    if (chart && chart.labels) {
      Object.keys(chart.labels).forEach((i) => {
        if (data.cols[i] && chart.labels![i]) {
          data.cols[i].label = chart.labels![i]
        }
      })
    }
  }

  return (
    <div className={`${css.chart} ${onSelect ? css.chartWithOnSelect : css.chartWithoutOnSelect}`}>
      <Chart
        chartType={type}
        data={data}
        width="100%"
        height="400px"
        options={chartOptions}
        mapsApiKey={mapsApiKey}
        chartEvents={[
          {
            eventName: 'select',
            callback: handleSelect,
          },
        ]}
      />
    </div>
  )
}
