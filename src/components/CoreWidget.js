/* global window gapi */
import React from 'react'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import debounceRender from 'react-debounce-render';
import Spinner from 'part:@sanity/components/loading/spinner'
import mainConfig from 'config:google-analytics-plugin'
import GoogleMaterialDataChart from './GoogleMaterialDataChart'
import GoogleProvider from'./GoogleProvider'
import Loading from './Loading'

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

class CoreWidget extends React.Component {

  _interval = undefined

  state = {
    hasGapi: false
  }

  componentDidMount() {
    initGoogleAPI()
    this._interval = setInterval(this.init, 100)
  }

  init = () => {
    if (typeof window !== 'undefined' && window.gapi) {
      this.setState({hasGapi: true})
      clearInterval(this._interval)
    }
  }

  render() {
    const {type, level, clientId, views, children, config} = this.props

    const {hasGapi} = this.state

    if (!mainConfig) {
      return <p>Please add <code>google-analytics-plugin.json</code> to your config folder</p>
    }

    if (!hasGapi) {
      return <Loading />
    }

    return (
      <GoogleProvider clientId={mainConfig.clientId}>
        {
          children || <GoogleMaterialDataChart {...this.props} views={views || mainConfig.views} />
        }
      </GoogleProvider>
    )
  }
}

export default CoreWidget