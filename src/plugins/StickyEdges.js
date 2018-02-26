export default class StickyEdges {
  static toString = () => {
    return 'StickyEdges Plugin'
  }

  constructor ({ right = true, left = false } = {}) {
    this.updateOptions(arguments[0])
  }

  updateOptions = (options) => {
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

  activate = (dygraph) => {
    let shouldStickRight = false
    let shouldStickLeft = false

    const dataWillUpdate = (e) => {
      if (e.dygraph.rawData_) {
        const [min, max] = e.dygraph.xAxisExtremes()

        if (e.dygraph.dateWindow_ === undefined ||
          e.dygraph.dateWindow_ === null
        ) {
          e.dygraph.dateWindow_ = [min, max]
        }

        shouldStickRight = this.stickyRight && e.dygraph.dateWindow_[1] === max
        shouldStickLeft = this.stickyLeft && e.dygraph.dateWindow_[0] === min
      }
    }

    const predraw = (e) => {
      if (e.dygraph.rawData_ && e.dygraph.dateWindow_ !== undefined) {
        const dateWindow = e.dygraph.dateWindow_.slice(0)

        if (shouldStickRight) {
          dateWindow[1] = e.dygraph.rawData_[e.dygraph.rawData_.length - 1][0]
        }
        if (shouldStickLeft) {
          dateWindow[0] = e.dygraph.rawData_[0][0]
        }

        e.dygraph.dateWindow_ = dateWindow
      }
    }

    return { dataWillUpdate, predraw }
  }
}
