/* global gapi */
import React from 'react'
import PropTypes from 'prop-types'

class GoogleProvider extends React.Component {
  state = {
    ready: false,
    loggedIn: false
  }

  authButtonNode = React.createRef()

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
          container: this.authButtonNode.current
        })
    }

    gapi.analytics.ready(a => {
      const authResponse = gapi.analytics.auth.getAuthResponse();
      if (!authResponse) {
        gapi.analytics.auth.on("success", response => {
          this.setState({ready: true, loggedIn: true})
        })
      } else {
        this.setState({ready: true})
      }
      doAuth()
    })
  }

  render() {
    const {loggedIn} = this.state

    const hiddenStyles = {
      opacity: 0,
      height: 0,
      overflow: 'hidden'
    }

    return (
      <div className="sanity-plugin-google-analytics--provider">
        {this.props.clientId && (
          <div style={loggedIn ? hiddenStyles : {}} ref={this.authButtonNode} />
        )}
        {this.state.ready && this.props.children}
      </div>
    )
  }
}

GoogleProvider.propTypes = {
  clientId: PropTypes.string
}

export default GoogleProvider