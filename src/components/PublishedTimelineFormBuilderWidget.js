import React from 'react'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import { withDocument } from 'part:@sanity/form-builder'
import CoreWidget from './CoreWidget'
import config from 'config:@sanity/google-analytics-plugin'
import { Chart } from "react-google-charts";

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const js = document.createElement('script');
    const fs = document.getElementsByTagName('script')[0];
    js.src = url;
    fs.parentNode.insertBefore(js, fs);
    js.onload = resolve;
    js.onerror = reject;
  });
}

let gvizLoadPromise = null;
const loadGviz = () => {
  return gvizLoadPromise ||
      (gvizLoadPromise = new Promise((resolve, reject) => {
        loadScript('https://www.gstatic.com/charts/loader.js').then(() => {
          google.charts.load('current', {'packages': ['corechart']});
          google.charts.setOnLoadCallback(resolve);
        }, reject);
      }));
};

const TEST_OPTIONS = {
  // reportType: 'ga',
  query: {
    ids: config.views,
    output: 'dataTable',
    dimensions: 'ga:date',
    metrics: 'ga:bounceRate, ga:bounces, ga:pageViews',
    'start-date': '30daysAgo',
    'end-date': 'yesterday'
  }
}

class PublishedTimelineFormBuilderWidget extends React.Component {
  state = {
    dataTable: undefined
  }

  componentDidMount() {
    loadGviz()
  }

  handleLoggedIn = event => {
    const {type, document} = this.props
    
    // Query parameters 
    // https://developers.google.com/analytics/devguides/reporting/core/v3/reference#q_summary

    // Component reference
    // https://developers.google.com/analytics/devguides/reporting/embed/v1/component-reference

    const report = new gapi.analytics.report.Data(TEST_OPTIONS)

    report.on('success', response => {
      console.log('analyticsDataTable', response.dataTable)

      // Google datatable
      const googleDataTable = new google.visualization.DataTable(response.dataTable)
      googleDataTable.addColumn({type: 'string', role: 'annotation'})
      googleDataTable.addColumn({type: 'string', role: 'annotationText'})

      googleDataTable.setCell(10, 4, 'Published')
      googleDataTable.setCell(10, 5, 'Published text')
      
      console.log('googleDataTable', googleDataTable)
      //this.setState({dataTable: response.dataTable})
      this.setState({
        dataTable: {
          cols: googleDataTable.vg,
          rows: googleDataTable.wg
        }
      })
    })

    report.execute()
  }

  handleSelect = ({ chartWrapper }) => {
    const chart = chartWrapper.getChart()
    const selection = chart.getSelection()
    if (selection.length === 1) {
      const [selectedItem] = selection
      const dataTable = chartWrapper.getDataTable()
      const { row, column } = selectedItem
      alert(
        'You selected: Look up in history' +
          JSON.stringify({
            row,
            column,
            value: dataTable.getValue(row, column),
          }),
        null,
        2,
      )
    }
    console.log(selection)
  }

  addPublished = data => {
    return data
  }

  render() {
    const {type, level, document} = this.props
    const {dataTable} = this.state
    const {options = {}} = type
    console.log('render dataTable:', dataTable)
    return (
      <Fieldset level={level} legend={type.title} description={type.description}>
      {
        options && options.gaConfig ? (
          <CoreWidget onLoggedIn={this.handleLoggedIn}>
            {dataTable && (
              <Chart
                chartType="LineChart"
                data={dataTable}
                width="100%"
                height="400px"
                legendToggle
                options={{
                  annotations: {
                    style: 'line'
                  }
                }}
                chartEvents={[
                  {
                    eventName: 'select',
                    callback: this.handleSelect
                  }
                ]}
              />
            )}
          </CoreWidget>
        ) :
        (<p>Use <code>gaConfig</code> on <options>options</options> to config your google analytics widget</p>)
      }
      </Fieldset>
    )
  }
}

export default withDocument(PublishedTimelineFormBuilderWidget)