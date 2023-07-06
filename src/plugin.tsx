import {DashboardWidget, LayoutConfig} from '@sanity/dashboard'
import React from 'react'

import Widget, {WidgetProps} from './components/Widget'

export interface GoogleAnalyticsWidgetConfig {
  layout?: LayoutConfig
  options: WidgetProps
}

export default function googleAnalyticsWidget(
  config: GoogleAnalyticsWidgetConfig
): DashboardWidget {
  return {
    name: 'google-analytics',
    component: () => <Widget {...config.options} />,
    layout: config.layout,
  }
}
