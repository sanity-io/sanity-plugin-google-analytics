import React from "react";
import { render } from "react-dom";
import PropTypes from 'prop-types';

// dont wait for auth twice, even after unmounts
let isLoaded = false;

// wait for auth to display children
class GoogleProvider extends React.Component {
  state = {
    ready: false
  };
  componentDidMount() {
    this.init();
  }
  init = () => {
    const doAuth = () => {
      const authObj = this.props.accessToken ?
        {serverAuth: {access_token: this.props.accessToken}} :
        {clientid: this.props.clientId};
      gapi.analytics.auth &&
        gapi.analytics.auth.authorize({
          ...authObj,
          container: this.authButtonNode
        });
    }

    gapi.analytics.ready(a => {
      if (isLoaded) {
        this.setState({
          ready: true
        });
        return
      }
      const authResponse = gapi.analytics.auth.getAuthResponse();
      if (!authResponse) {
        gapi.analytics.auth.on("success", response => {
          this.setState({ready: true})
        });
      } else {
        this.setState({
          ready: true
        });
      }
      doAuth();
    })
  }
  render() {
    return (
      <div className="sanity-plugin-google-analytics--provider">
        {this.props.clientId && <div ref={node => (this.authButtonNode = node)} />}
        {this.state.ready && this.props.children}
      </div>
    );
  }
}

GoogleProvider.propTypes = {
  clientId: PropTypes.string,
  accessToken: PropTypes.string,
}

export default GoogleProvider