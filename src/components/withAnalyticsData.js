/* global gapi  */
import React from "react"
import { render } from "react-dom"
import PropTypes from 'prop-types'
import mainConfig from 'config:google-analytics-plugin'
import withAnalyticsAuth from './withAnalyticsAuth'
import Spinner from 'part:@sanity/components/loading/spinner'
import GoogleProvider from './GoogleProvider'
import CoreWidget from './CoreWidget'
import Loading from './Loading'

export default function withAnalyticsData(Component, data) {
  return class extends React.Component {
    _interval = undefined
    state = {
      data: undefined,
      config: undefined,
    }

    componentDidMount() {
      this._interval = setInterval(this.loadChart, 100)
    }
  
    loadChart = () => {
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

      clearInterval(this._interval)
  
      const newConfig = {
        ...config,
        query: {
          ...config.query,
          output: config.query.output || 'json',
          ids: this.props.views || mainConfig.views
        }
      }
  
      const report = new gapi.analytics.report.Data({query: newConfig.query})
  
      report.on('success', res => {
        
        if (this.state.data && this.state.isLoaded) {
          return
        }
        
        this.setState({
          // data: res.dataTable || res.rows,
          data: res.rows,
          config: newConfig,
          isLoaded: true
        })
      })
  
      report.execute()
    }

    handleSelect = event => {
      const {gaConfig} = this.props
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

        if (gaConfig.onSelect) {
          gaConfig.onSelect(selectedItem, cell, event)
        }
      }
    }

    render() {
      const {data, newConfig} = this.state
      const {type, level, clientId, views, children, gaConfig} = this.props

      return (
        <CoreWidget>
          {data ? <Component {...this.props} data={data} onSelect={this.handleSelect} /> : <Loading />}
        </CoreWidget>
      )
    }
  }
} 

