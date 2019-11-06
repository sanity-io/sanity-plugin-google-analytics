/* global google */
import React from "react"
import { render } from "react-dom"
import PropTypes from 'prop-types'
import { Chart } from "react-google-charts"
import mainConfig from 'config:@sanity/google-analytics-plugin'
import Spinner from 'part:@sanity/components/loading/spinner'

function convertTypeToMaterial(chartType) {
  switch (chartType) {
    case 'LINE':
      return 'Line'
    case 'BAR':
      return 'Bar'
    case 'GEO':
      return 'GeoChart'
    case 'TABLE':
      return 'Table'
    case 'PIE':
      console.warn('Material has problems rendering pie charts')
      return 'PieChart'
  }
  return chartType
}

export default class GoogleDataChart extends React.Component { 
  state = {
    dataTable: undefined,
    config: undefined,
    isLoaded: false
  }

  componentDidMount() {
    this.loadChart();
  }
  componentWillUpdate() {
    this.loadChart();
  }

  loadChart = () => {
    const {config} = this.props
    if (!config) {
      return
    }

    const newConfig = {
      ...config,
      query: {
        ...config.query,
        output: 'dataTable',
        ids: this.props.views
      }
    }

    const report = new gapi.analytics.report.Data({query: newConfig.query})

    report.on('success', res => {
      if (this.state.isLoaded) {
        return
      }
      this.setState({
        dataTable: res.dataTable,
        config: newConfig,
        isLoaded: true
      })
    })

    report.execute()
  }

  handleSelect = event => {
    console.log('select', event)
  }

  render() {
    const {dataTable, config} = this.state

    if (!dataTable) {
      return <Spinner message="Loading" />
    }

    return (
      <div>
        <Chart
          {...this.props}
          chartType={convertTypeToMaterial(config.chart.type || 'Line')}
          data={dataTable}
          width="100%"
          height="400px"
          legendToggle
          options={config.options}
          mapsApiKey={mainConfig.mapsApiKey}
          chartEvents={[
            {
              eventName: 'select',
              callback: this.handleSelect
            }
          ]}
        />
      </div> 
    )
  }
}