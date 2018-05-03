import React from 'react'
import ReactDOM from 'react-dom'
import { Dygraph } from '../src'

const container = document.createElement('div')
document.body.appendChild(container)

const startDate = new Date()

class DygraphDemo extends React.Component {
  displayName = 'DygraphDemo'

  state = {
    data: [
      [startDate, 10, 100],
      [new Date(startDate.getTime() + 24 * 60 * 60 * 1000 * 1), 20, 80],
      [new Date(startDate.getTime() + 24 * 60 * 60 * 1000 * 2), 50, 60],
      [new Date(startDate.getTime() + 24 * 60 * 60 * 1000 * 3), 70, 80],
    ],
  }

  handleDateWindowChange = (a) => {
    console.log(a)
  }

  handlePointClick = (e, point) => {
    this.setState({clicked: point.idx})
  }

  render () {
    return (
      <div>
        <Dygraph
          data={this.state.data}
          fixedYAxis
          onDateWindowChanged={this.handleDateWindowChange}
          onPointClick={this.handlePointClick}
          showRangeSelector
          strokeWidth={3}
          valueRange={[0, 120]}
          width={1200}
        />
      </div>
    )
  }
}

ReactDOM.render(<DygraphDemo />, container)
