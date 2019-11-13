/* global gapi  */
import React from "react"
import { render } from "react-dom"
import PropTypes from 'prop-types'
import mainConfig from 'config:google-analytics-plugin'
import withAnalyticsAuth from './withAnalyticsAuth'
import Spinner from 'part:@sanity/components/loading/spinner'
import GoogleProvider from './GoogleProvider'
import CoreWidget from "./CoreWidget"

export default function withAnalyticsData(Component, data) {
  return class extends React.Component { 
    state = {
      dataTable: undefined,
      config: undefined,
      chartIsLoaded: false,
      apiIsLoaded: false
    }

    componentDidMount() {
      this.loadChart();
    }
    componentWillUpdate() {
      this.loadChart();
    }
  
    loadChart = () => {
      console.log('Try load chart')
      

      const {config} = this.props
      if (
        !config
        || typeof window === 'undefined'
        || typeof gapi === 'undefined'
        || typeof gapi.analytics === 'undefined'
        || typeof gapi.analytics.report === 'undefined'
      ) {
        console.error('Missing gapi analytics')
        return false
      }

      

      console.log('### WE GOT CHART ###')
  
      const newConfig = {
        ...config,
        query: {
          ...config.query,
          output: 'dataTable',
          ids: this.props.views || mainConfig.views
        }
      }
  
      const report = new gapi.analytics.report.Data({query: newConfig.query})
  
      report.on('success', res => {
        if (this.state.dataTable && this.state.isLoaded) {
          console.log('Already loaded and has data table', this.state.dataTable)
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
      console.log('handleSelect')
      // const {gaConfig} = this.props
      // const {chartWrapper} = event
      // const chart = chartWrapper.getChart()
      // const selection = chart.getSelection()
      
      // if (selection.length === 1) {
      //   const [selectedItem] = selection
      //   const dataTable = this.state.dataTable
      //   const { row, column } = selectedItem

      //   let cell = undefined

      //   if (typeof row === 'number' && typeof column === 'number') {
      //     cell = dataTable.rows[row].c[column].v
      //   } else if (typeof row === 'number' && typeof column !== 'number') {
      //     cell = dataTable.rows[row]
      //   }

      //   if (gaConfig.onSelect) {
      //     gaConfig.onSelect(selectedItem, cell, event)
      //   }
      // }
    }

    handleOnLoggedIn = () => {
      console.log('handleLoggedIn withAnalyticsData')
      // this.loadChart()
    }

    handleReady = () => {
      console.log('ready')
      this.loadChart()
    }

    render() {
      console.log('render withAnalyticsData', this.props, this.state)

      if (!mainConfig) {
        return <p>Please add <code>google-analytics-plugin.json</code> to your config folder</p>
      }
      const {dataTable, newConfig} = this.state
      const {type, level, clientId, views, children, gaConfig} = this.props

      return (
        <CoreWidget>
          <div>With analytics data widget</div>
          {dataTable && (
            <Component
              dataTable={dataTable}
              onSelect={this.handleSelect}
            />
          )}
        </CoreWidget>
      )
    }
  }
} 

