import Downsampler from 'downsample-lttb'
import { addEvent, removeEvent } from 'dygraphs/src/dygraph-utils'
import Dygraphs from 'dygraphs'

const getRangeSelectorCanvas = dygraph => {
  return dygraph.plugins_.find(p => p.plugin instanceof Dygraphs.Plugins.RangeSelector).plugin.fgcanvas_
}

export default class Downsample {
  static toString = () => {
    return 'Downsample Plugin'
  }

  constructor (options) {
    this.visibleThreshold = Infinity
    this.invisibleThreshold = 100
    this.mousedown = false
    this.dygraph = null

    if (options) {
      if (options.visibleThreshold) {
        this.visibleThreshold = options.visibleThreshold
      }

      if (options.invisibleThreshold) {
        this.invisibleThreshold = options.invisibleThreshold
      }
    }
  }

  mousedownHandler = (e) => {
    this.mousedown = true
  }

  mouseupHandler = (e) => {
    if (this.mousedown) {
      this.dygraph.updateOptions({file: this.dygraph.file_}, false)
      this.mousedown = false
    }
  }

  rangeSelectorHandler = (e) => {
    this.mousedown = true
  }

  activate = (dygraph) => {
    let from
    let to

    const extractSeries = (rawData, seriesIndex, options) => {
      let newData = []
      const series = []

      for (let i = 0; i < rawData.length; i++) {
        series.push([rawData[i][0], rawData[i][seriesIndex]])
      }

      let leftBoundary = series.findIndex(data => data[0] >= from)
      let rightBoundary = series.findIndex(data => data[0] >= to)

      if (leftBoundary > 0) {
        newData = newData.concat(
          Downsampler.processData(series.slice(0, leftBoundary), this.invisibleThreshold)
        )
      }

      newData = newData.concat(
        Downsampler.processData(series.slice(leftBoundary, rightBoundary), this.visibleThreshold)
      )

      if (rightBoundary < series.length) {
        newData = newData.concat(
          Downsampler.processData(
            series.slice(rightBoundary), this.invisibleThreshold
          )
        )
      }

      return newData
    }

    this.dygraph = dygraph

    this.events = [
      [dygraph.maindiv_, 'mousedown', this.mousedownHandler],
      [window, 'mouseup', this.mouseupHandler],
    ]

    if (dygraph.getBooleanOption('showRangeSelector')) {
      this.events.push([getRangeSelectorCanvas(this.dygraph), 'mousedown', this.rangeSelectorHandler])
    }

    this.events.map(e => addEvent(...e))

    const predraw = (e) => {
      [from, to] = e.dygraph.xAxisRange()

      e.dygraph.dataHandler_.extractSeries = extractSeries
    }

    return { predraw }
  }

  destroy = (e) => {
    this.events.map(e => removeEvent(...e))
  }
}
