export default class StickyEdges {
  constructor ({ right = true, left = false } = {}) {
    this.updateOptions = this.updateOptions.bind(this)
    this.activate.bind(this)

    this.updateOptions(arguments[0])
  }

  updateOptions (options) {
    if (typeof options === 'boolean') {
      this.stickyRight = options
      this.stickyLeft = options
    } else if (typeof options === 'object') {
      this.stickyRight = !!options.right
      this.stickyLeft = !!options.left
    } else {
      throw new Error('Invalid options for StickyEdges plugin')
    }
  }

  activate (dygraph) {
    let stickyRight = this.stickyRight
    let stickyLeft = this.stickyLeft

    let shouldStickRight = false
    let shouldStickLeft = false

    const dataWillUpdate = (e) => {
      if (e.dygraph.rawData_) {
        const dateWindow = e.dygraph.dateWindow_

        if (stickyRight) {
          const lastPointTimestamp = e.dygraph.rawData_[e.dygraph.rawData_.length - 1][0]

          shouldStickRight = dateWindow && dateWindow[1] === lastPointTimestamp
        }

        if (stickyLeft) {
          const firstPointTimestamp = e.dygraph.rawData_[0][0]

          shouldStickLeft = dateWindow && dateWindow[0] === firstPointTimestamp
        }
      }
    }

    const predraw = (e) => {
      if (e.dygraph.rawData_) {
        if (shouldStickRight) {
          e.dygraph.dateWindow_[1] = e.dygraph.rawData_[e.dygraph.rawData_.length - 1][0]
        }
        if (shouldStickLeft) {
          e.dygraph.dateWindow_[0] = e.dygraph.rawData_[0][0]
        }
      }
    }

    return { dataWillUpdate, predraw }
  }
}

StickyEdges.toString = () => {
  return 'StickyEdges Plugin'
}
