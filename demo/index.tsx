import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import { Dygraph } from '@src'
import type { dygraphs } from '@qogni/dygraphs'

const container = document.createElement('div')
document.body.appendChild(container)

const startDate = new Date()

class DygraphDemo extends React.Component {
  displayName = 'DygraphDemo'

  state = {
    data: [
      [startDate, 10, 100],
      [new Date(startDate.getTime() + 24 * 60 * 60 * 1000 * 12), 20, 80],
      [new Date(startDate.getTime() + 24 * 60 * 60 * 1000 * 14), 40, 70],
      [new Date(startDate.getTime() + 24 * 60 * 60 * 1000 * 24), 50, 60],
      [new Date(startDate.getTime() + 24 * 60 * 60 * 1000 * 36), 70, 80],
    ],
  }

  handlePointClick: dygraphs.Options['pointClickCallback'] = (e, point) => {
    this.setState({ clicked: point.idx })
  }

  gapThresholdFunction = (prevPoint: dygraphs.Point, curPoint: dygraphs.Point) => {
    if (curPoint.xval === undefined || prevPoint.xval === undefined) {
      return false
    }

    return (curPoint.xval - prevPoint.xval) >= (24 * 60 * 60 * 1000 * 12)
  }

  teste1gapThresholdFunction = (prevPoint: dygraphs.Point, curPoint: dygraphs.Point) => {
    if (curPoint.xval === undefined || prevPoint.xval === undefined) {
      return false
    }

    return (curPoint.xval - prevPoint.xval) >= (24 * 60 * 60 * 1000 * 24)
  }

  render() {
    return (
      <Dygraph
        connectSeparatedPoints
        data={this.state.data}
        fixedYAxis
        gapThreshold={this.gapThresholdFunction}
        labels={['tempo', 'teste1', 'teste2']}
        onPointClick={this.handlePointClick}
        series={{
          teste1: {
            gapThreshold: this.teste1gapThresholdFunction,
          },
        }}
        showLabelsOnHighlight={false}
        showRangeSelector
        strokeWidth={3}
        valueRange={[0, 120]}
        width={1200}
      />
    )
  }
}

const root = createRoot(container)
root.render(<DygraphDemo />)
