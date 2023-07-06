import {DashboardWidgetContainer} from '@sanity/dashboard'
import {Card} from '@sanity/ui'
import React from 'react'

import {
  GoogleAnalyticsClientConfig,
  GoogleAnalyticsReportProvider,
} from '../contexts/GoogleAnalyticsReportContext'
import GoogleMaterialDataChart, {GoogleMaterialDataChartProps} from './GoogleMaterialDataChart'
import css from './Widget.css'

export interface GAConfig extends GoogleAnalyticsClientConfig, GoogleMaterialDataChartProps {}

export interface WidgetProps {
  title: string
  gaConfig: GAConfig
}

export default function Widget(props: WidgetProps) {
  const {title, gaConfig} = props
  const providerProps = (({clientId, propertyId, query}) => ({
    clientId,
    propertyId,
    query,
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
