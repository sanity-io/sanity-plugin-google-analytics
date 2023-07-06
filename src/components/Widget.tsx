import {DashboardWidgetContainer} from '@sanity/dashboard'
import {Card} from '@sanity/ui'
import React from 'react'

import {
  GoogleAnalyticsClientConfig,
  GoogleAnalyticsReportProvider,
} from '../contexts/GoogleAnalyticsReportContext'
import GoogleMaterialDataChart, {GoogleMaterialDataChartProps} from './GoogleMaterialDataChart'
import css from './Widget.css'

export interface GAConfig extends GoogleAnalyticsClientConfig, GoogleMaterialDataChartProps {
  views: string
}

export interface WidgetProps {
  title: string
  gaConfig: GAConfig
}

export default function Widget(props: WidgetProps) {
  const {title, gaConfig} = props
  const providerProps = (({clientId, views, query}) => ({
    clientId,
    query: {
      // set defaults for ids and output fields to what the widget expects
      ids: views,
      output: 'dataTable',
      ...query,
    },
  }))(gaConfig)
  const chartProps = (({mapsApiKey, chart, onSelect}) => ({
    mapsApiKey,
    chart,
    onSelect,
  }))(gaConfig)
  return (
    <DashboardWidgetContainer header={title || 'No title set'}>
      <Card className={css.chart}>
        {gaConfig ? (
          <GoogleAnalyticsReportProvider {...providerProps}>
            <GoogleMaterialDataChart {...chartProps} />
          </GoogleAnalyticsReportProvider>
        ) : (
          <p>
            Use <code>gaConfig</code> to config your google analytics widget
          </p>
        )}
      </Card>
    </DashboardWidgetContainer>
  )
}
