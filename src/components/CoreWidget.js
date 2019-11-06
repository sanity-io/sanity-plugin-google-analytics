/* global window gapi */
import React from 'react'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import debounceRender from 'react-debounce-render';
import Spinner from 'part:@sanity/components/loading/spinner'
import mainConfig from 'config:@sanity/google-analytics-plugin'
import GoogleDataChart from './GoogleDataChart'
import GoogleMaterialDataChart from './GoogleMaterialDataChart'
import GoogleProvider from'./GoogleProvider'

const initGoogleAPI = () => {
  // Check that the google api is not initialized before
  if (typeof window !== 'undefined' && typeof gapi === 'undefined') {    
    // eslint-disable-next-line max-params
    ;(function(w, d, s, g, js, fjs) {
      g = w.gapi || (w.gapi = {})
      g.analytics = {
        q: [],
        ready(cb) {
          this.q.push(cb)
        }
      }
      js = d.createElement(s)
      fjs = d.getElementsByTagName(s)[0]
      js.src = 'https://apis.google.com/js/platform.js'
      fjs.parentNode.insertBefore(js, fjs)
      js.onload = function() {
        g.load('analytics')
      }
    })(window, document, 'script')
  }
}

const useMaterial = config => {
  if (!config) {
    return false
  }
  if (config.useMaterial) {
    return true
  }
}

class CoreWidget extends React.Component {

  componentDidMount() {
    initGoogleAPI()
  }

  render() {
    const {type, level, clientId, views, children, config} = this.props
    if (typeof window == 'undefined' || typeof gapi === 'undefined') {
      return <Spinner message="Loading chart" center />
    }
    const Chart = useMaterial(config) ? GoogleMaterialDataChart : GoogleDataChart

    return (
      <GoogleProvider clientId={mainConfig.clientId} onLoggedIn={this.props.onLoggedIn}>
        {
          children || <Chart {...this.props} views={views || mainConfig.views} />
        }
      </GoogleProvider>
    )
  }
}

export default CoreWidget