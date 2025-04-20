import React from 'react'
import { default as DygraphBase } from '@qogni/dygraphs'
import DayMarker from '../plugins/DayMarker'
import ChartBackground from '../plugins/ChartBackground'
import ChartBorder from '../plugins/ChartBorder'
import FixedYAxis from '../plugins/FixedYAxis'
import Normalize from '../plugins/Normalize'
import Downsample from '../plugins/Downsample'
import StickyEdges from '../plugins/StickyEdges'
import SupressEmptyDataError from '../plugins/SupressEmptyDataError'
import VisibilityRedraw from '../plugins/VisibilityRedraw'
import ConstrainDateWindow from '../plugins/ConstrainDateWindow'
import { ReactDygraphProps, splitProps } from './DygraphProps'
import { getInteractionModelProxy } from '../proxy/InteractionModelProxy'

export default class Dygraph extends React.PureComponent<ReactDygraphProps> {
  displayName = 'Dygraph'

  private interactionModel: object = {}
  private root: HTMLDivElement | null = null
  private dygraph: DygraphBase | null = null
  private normalizePlugin: Normalize | null = null
  private downsamplePlugin: Downsample | null = null
  private stickyEdgesPlugin: StickyEdges | null = null
  private constrainDateWindowPlugin: ConstrainDateWindow | null = null
  private fixedYAxisPlugin: FixedYAxis | null = null

  componentDidMount() {
    const { dygraphsProps: initAttrs } = splitProps(this.props)

    this.interactionModel = initAttrs.interactionModel || DygraphBase.defaultInteractionModel
    initAttrs.interactionModel = getInteractionModelProxy(this.interactionModel)

    if (!initAttrs.plugins) {
      initAttrs.plugins = []
    }

    initAttrs.plugins.push(new SupressEmptyDataError())
    initAttrs.plugins.push(new VisibilityRedraw())

    if (this.props.dayMarker) {
      initAttrs.plugins.push(new DayMarker())
    }
    if (this.props.chartBorder) {
      initAttrs.plugins.push(new ChartBorder())
    }

    if (this.props.chartBackground) {
      if (typeof this.props.chartBackground === 'boolean') {
        initAttrs.plugins.push(new ChartBackground())
      } else {
        initAttrs.plugins.push(new ChartBackground(this.props.chartBackground))
      }
    }

    if (this.props.normalize) {
      this.normalizePlugin = new Normalize(this.props.normalize)
      initAttrs.plugins.push(this.normalizePlugin)
    }

    if (this.props.downsample) {
      this.downsamplePlugin = new Downsample(
        typeof this.props.downsample === 'boolean' ? null : this.props.downsample,
      )

      initAttrs.plugins.push(this.downsamplePlugin)
    }

    if (this.props.fixedYAxis) {
      this.fixedYAxisPlugin = new FixedYAxis()
      initAttrs.plugins.push(this.fixedYAxisPlugin)
    }

    if (this.props.stickyEdges) {
      this.stickyEdgesPlugin = new StickyEdges(this.props.stickyEdges)
      initAttrs.plugins.push(this.stickyEdgesPlugin)
    }

    if (this.props.constrainDateWindow) {
      this.constrainDateWindowPlugin = new ConstrainDateWindow()
      initAttrs.plugins.push(this.constrainDateWindowPlugin)
    }

    initAttrs.labels = this.props.labels ?? []

    if (this.root !== null) {
      this.dygraph = new DygraphBase(this.root, this.props.data ?? [], initAttrs)
    }

    let dateWindow: DygraphBase['dateWindow_']
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    Object.defineProperty(this.dygraph, 'dateWindow_', {
      enumerable: true,
      get() { return dateWindow },
      set(value) {
        if (dateWindow === undefined
          || dateWindow === null
          || value === undefined
          || value === null
          || value[0] !== dateWindow[0]
          || value[1] !== dateWindow[1]
        ) {
          dateWindow = value
          if (self.props.onDateWindowChanged) {
            self.props.onDateWindowChanged(value)
          }
        }
      },
    })
  }

  componentDidUpdate(prevProps: ReactDygraphProps) {
    if (!this.dygraph) {
      return
    }

    const { dygraphsProps: updateAttrs } = splitProps(this.props)

    const newInteractionModel = updateAttrs.interactionModel || DygraphBase.defaultInteractionModel

    if (this.interactionModel !== newInteractionModel) {
      this.interactionModel = getInteractionModelProxy(newInteractionModel)
    }

    if (this.props.normalize && this.props.normalize !== prevProps.normalize) {
      this.normalizePlugin?.updateOptions(this.props.normalize)
    }

    if (this.props.stickyEdges && this.props.stickyEdges !== prevProps.stickyEdges) {
      this.stickyEdgesPlugin?.updateOptions(this.props.stickyEdges)
    }

    this.dygraph.updateOptions(updateAttrs)
  }

  componentWillUnmount() {
    if (this.dygraph) {
      this.dygraph.destroy()
      this.dygraph = null
    }
  }

  render() {
    return (
      <div
        ref={root => (this.root = root)}
        style={this.props.style}
      />
    )
  }
}
