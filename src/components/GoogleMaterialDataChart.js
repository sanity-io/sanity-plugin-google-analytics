/* global google */
import React from "react"
import { render } from "react-dom"
import PropTypes from 'prop-types'
import { Chart } from "react-google-charts"
import mainConfig from 'config:google-analytics-plugin'
import Spinner from 'part:@sanity/components/loading/spinner'
import css from './GoogleMaterialDataChart.css'

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
      return 'Pie'
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
    const {config} = this.props
    const {chartWrapper} = event
    const chart = chartWrapper.getChart()
    const selection = chart.getSelection()
    

    if (selection.length === 1) {
      const [selectedItem] = selection
      const dataTable = this.state.dataTable
      const { row, column } = selectedItem

      let cell = undefined

      if (typeof row === 'number' && typeof column === 'number') {
        cell = dataTable.rows[row].c[column].v
      } else if (typeof row === 'number' && typeof column !== 'number') {
        cell = dataTable.rows[row]
      }

      if (config.onSelect) {
        config.onSelect(selectedItem, cell, event)
      }
      
    }
  }

  render() {
    const {dataTable, config} = this.state

    if (!dataTable) {
      return <div style={{paddingTop: '15rem', position: 'relative'}}><Spinner message="Loading analytics" center /></div>
    }

    const type = convertTypeToMaterial(config.chart.type || 'Line')

    if (type === 'Pie') {
      return <div>Pie is not supported yet</div>
    }

    return (
      <div className={css.chart}>
        <Chart
          chartType={type}
          data={dataTable}
          width="100%"
          height="400px"
          options={config.chart}
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