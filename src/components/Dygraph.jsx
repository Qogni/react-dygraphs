import React from 'react'
import PropTypes from 'prop-types'
import DygraphBase from 'dygraphs'
import { propTypes as dygraphPropTypes, spreadProps as spreadKnownProps } from './Dygraph/options'

class InteractionModelProxy {
  constructor () {
    for (const method of ['mousedown', 'touchstart', 'touchmove', 'touchend', 'dblclick']) {
      const thisProxy = this
      this[method] = function (...args) {
        const calledContext = this
        return thisProxy._target[method].call(calledContext, ...args)
      }
    }
    ['willDestroyContextMyself'].forEach(prop => {
      Object.defineProperty(this, prop, {
        configurable: false,
        enumerable: true,
        get: () => this._target[prop],
        set: value => (this._target[prop] = value),
      })
    })
  }

  _target = DygraphBase.defaultInteractionModel
}

export default class Dygraph extends React.Component {
  displayName = 'Dygraph'

  static propTypes = Object.assign({style: PropTypes.object}, dygraphPropTypes)

  componentDidMount () {
    const {known: initAttrs} = spreadKnownProps(this.props, true)
    this._interactionProxy._target =
      initAttrs.interactionModel || DygraphBase.defaultInteractionModel
    initAttrs.interactionModel = this._interactionProxy
    this._dygraph = new DygraphBase(this.root, this.props.data, initAttrs)
  }

  componentWillUpdate (nextProps) {
    if (this._dygraph) {
      const {known: updateAttrs} = spreadKnownProps(nextProps, false)
      this._interactionProxy._target =
        updateAttrs.interactionModel || DygraphBase.defaultInteractionModel
      updateAttrs.interactionModel = this._interactionProxy
      this._dygraph.updateOptions(updateAttrs)
    }
  }

  componentWillUnmount () {
    if (this._dygraph) {
      this._dygraph.destroy()
      this._dygraph = null
    }
  }

  _interactionProxy = new InteractionModelProxy()

  render () {
    return (
      <div
        ref={(root) => (this.root = root)}
        style={this.props.style}
      />
    )
  }
}
