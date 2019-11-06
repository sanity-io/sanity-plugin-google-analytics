/* global gapi */
import React from "react";
import { render } from "react-dom";
import PropTypes from 'prop-types';

export default class GoogleDataChart extends React.Component {
  componentDidMount() {
    this.loadChart();
  }
  componentWillUpdate() {
    this.loadChart();
  }

  loadChart = () => {
    if (!this.props.config) {
      return
    }
    const config = {
      ...this.props.config,
      query: {
        ...this.props.config.query,
        output: 'dataTable',
        ids: this.props.views
      },
      chart: {
        ...this.props.config.chart,
        options: {
          ...this.props.config.chart.options,
          annotations: {
            style: 'point'
          }
        },
        container: this.chartNode
      },
    };

    this.chart = new gapi.analytics.googleCharts.DataChart(config);
    this.chart.execute();
  };
  render() {
    return (
      <div
        className={this.props.className}
        style={this.props.style}
        ref={node => (this.chartNode = node)}
      />
    );
  }
}