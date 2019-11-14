/* global gapi */
import React from 'react'
import PropTypes from 'prop-types'

class GoogleProvider extends React.Component {
  state = {
    ready: false
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    if (typeof gapi === 'undefined') {
      return
    }
    const doAuth = () => {
      const authObj =  {clientid: this.props.clientId}
      gapi.analytics.auth &&
        gapi.analytics.auth.authorize({
          ...authObj,
          container: this.authButtonNode
        })
    }

    gapi.analytics.ready(a => {
      const authResponse = gapi.analytics.auth.getAuthResponse();
      if (!authResponse) {
        gapi.analytics.auth.on("success", response => {
          this.setState({ready: true})
        })
      } else {
        this.setState({ready: true})
      }
      doAuth()
    })
  }

  render() {
    return (
      <div className="sanity-plugin-google-analytics--provider">
        {this.props.clientId && <div className="login" ref={node => (this.authButtonNode = node)} />}
        {this.state.ready && this.props.children}
      </div>
    )
  }
}

GoogleProvider.propTypes = {
  clientId: PropTypes.string
}

export default GoogleProvider