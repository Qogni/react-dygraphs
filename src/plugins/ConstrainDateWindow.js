export default class ConstrainDateWindow {
  static toString = () => {
    return 'ConstrainDateWindow Plugin'
  }

  constructor ({ constrainToData = true, minRangeWidth = 12 } = {}) {
    this.updateOptions(arguments[0])
  }

  updateOptions = (options) => {
    if (typeof options === 'object') {
      this.constrainToData = !!options.constrainToData
      this.minRangeWidth = options.minRangeWidth
    } else {
      throw new Error('Invalid options for ConstrainDateWindow plugin')
    }
  }

  activate = (dygraph) => {
    const predraw = (e) => {
      const plotArea = dygraph.layout_.getPlotArea()

      const [min, max] = e.dygraph.xAxisExtremes()
      const factor = Math.floor((max - min) / plotArea.w)
      const minWindowInterval = factor * this.minRangeWidth

      if (e.dygraph.rawData_ && e.dygraph.dateWindow_ !== undefined) {
        const dateWindow = e.dygraph.dateWindow_.slice(0)

        if (this.constrainToData) {
          if (e.dygraph.dateWindow_[1] > max) {
            dateWindow[1] = e.dygraph.rawData_[e.dygraph.rawData_.length - 1][0]
          }
          if (e.dygraph.dateWindow_[0] < min) {
            dateWindow[0] = e.dygraph.rawData_[0][0]
          }
        }

        const windowInterval = dateWindow[1] - dateWindow[0]

        if (windowInterval < minWindowInterval) {
          if (max - dateWindow[1] > dateWindow[0] - min) {
            dateWindow[1] += minWindowInterval - windowInterval
          } else {
            dateWindow[0] -= minWindowInterval - windowInterval
          }
        }

        e.dygraph.dateWindow_ = dateWindow
      }
    }

    return { predraw }
  }
}
