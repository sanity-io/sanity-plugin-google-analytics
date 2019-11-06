import React from 'react'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import { withDocument } from 'part:@sanity/form-builder'
import CoreWidget from './CoreWidget'


class FormBuilderWidget extends React.Component {
  render() {
    const {type, level, document} = this.props
    const {options = {}} = type
    return (
      <Fieldset level={level} legend={type.title} description={type.description}>
      {
        options && options.gaConfig ? (
          <CoreWidget {...options} config={options.gaConfig(document)} />
        ) :
        (<p>Use <code>gaConfig</code> on <options>options</options> to config your google analytics widget</p>)
      }
      </Fieldset>
    )
  }
}

export default withDocument(FormBuilderWidget)