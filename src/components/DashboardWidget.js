import React from 'react'
import CoreWidget from './CoreWidget'
import WidgetContainer from 'part:@sanity/dashboard/widget-container'
import css from './DashboardWidget.css'

class DashboardWidget extends React.Component {
  render() {
    const {gaConfig, title} = this.props
    return (
      <div className={css.container}>
        {gaConfig ? (
          <>
            <header className={css.header}>
              <h3 className={css.title}>{title || 'No title set'}</h3>
            </header>
            <div className={css.chart}>
              <CoreWidget config={gaConfig} />
            </div>
          </>
          ) :
          <p>Use <code>gaConfig</code> to config your google analytics widget</p>
        }
      </div>
    )
  }
}

export default {
  name: 'google-analytics',
  component: DashboardWidget,
}