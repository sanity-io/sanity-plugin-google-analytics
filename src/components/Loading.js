import React from 'react';
import Spinner from 'part:@sanity/components/loading/spinner'
import PropTypes from 'prop-types'

class Loading extends React.Component {
  render() {
    const {message} = this.props
    return (
      <div style={{paddingTop: '15rem', position: 'relative'}}>
        <Spinner message={message} center />
      </div>
    );
  }
}

Loading.propTypes = {
  message: PropTypes.string
}

Loading.defaultProps = {
  message: 'Loading analytics'
}

export default Loading