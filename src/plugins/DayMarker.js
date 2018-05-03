import { zeropad } from 'dygraphs/src/dygraph-utils'
import { Granularity } from 'dygraphs/src/dygraph-tickers'
import { pickDateTickGranularity } from '../Ticker/DateWorkaround'

export default class DayMarker {
  static defaultOptions = {
    color: 'rgba(0, 0, 0, 0.4)',
    dateFormatter: DayMarker.formatDate,
    font: 'sans serif',
    fontSize: 32,
    markerMargin: 10,
  }

  constructor (options = {}) {
    this.options = {
      ...options,
      ...DayMarker.defaultOptions,
    }
  }

  static toString = () => {
    return 'DayMarker Plugin'
  }

  static formatDate (date) {
    return zeropad(date.getDate()) + '/' + zeropad(date.getMonth() + 1)
  }

  getStepByGranularity (granularity) {
    if (granularity <= Granularity.SIX_HOURLY) {
      return 1
    } else if (granularity < Granularity.TWO_DAILY) {
      return 4
    }

    return 7
  }

  findDateX = (timestamp) => {
    if (timestamp > this.max) {
      return null
    }

    if (timestamp < this.min) {
      timestamp = this.min
    }

    return Math.floor((timestamp - this.min) / this.factor) + this.dygraph.layout_.getPlotArea().x
  }

  activate = (dygraph) => {
    this.dygraph = dygraph

    const originalCallback = dygraph.getFunctionOption('underlayCallback')

    let underlayCallback = (ctx, area, dygraph) => {
      if (dygraph.dateWindow_) {
        this.min = dygraph.dateWindow_[0]
        this.max = dygraph.dateWindow_[1]
      } else {
        [this.min, this.max] = dygraph.xAxisExtremes()
      }

      const plotAreaWidth = dygraph.layout_.getPlotArea().w
      this.factor = Math.floor((this.max - this.min) / plotAreaWidth)
      const granularity = pickDateTickGranularity(
        this.min,
        this.max,
        plotAreaWidth,
        dygraph.optionsViewForAxis_('x')
      )

      const step = this.getStepByGranularity(granularity)

      const temp = new Date(this.min)
      temp.setHours(0)
      temp.setMinutes(0)
      temp.setSeconds(0)
      temp.setMilliseconds(0)
      temp.setDate(1)
      temp.setDate(temp.getDate() - temp.getDay())

      if (granularity < Granularity.WEEKLY &&
      granularity > Granularity.SIX_HOURLY) {
        temp.setDate(temp.getDate() + temp.getDate() % 2)
      }

      const toDraw = [{
        x: this.findDateX(this.min),
        date: new Date(this.min),
      }]

      while (temp.getTime() < this.max) {
        const pos = this.findDateX(temp.getTime())

        if (temp.getTime() > this.min) {
          toDraw.push({
            x: pos,
            date: new Date(temp.getTime()),
          })
        }

        temp.setDate(temp.getDate() + step)
      }

      ctx.fillStyle = this.options.color
      ctx.font = this.options.fontSize + 'px ' + this.options.font

      for (let i = 0; i < toDraw.length; i++) {
        const text = this.options.dateFormatter(toDraw[i].date)
        const metrics = ctx.measureText(text)

        let pos = toDraw[i].x + this.options.markerMargin

        if (i + 1 < toDraw.length) {
          pos = Math.min(pos, toDraw[i + 1].x - metrics.width - this.options.markerMargin)
        }

        ctx.fillText(text, pos, this.options.fontSize)
      }

      if (originalCallback) {
        originalCallback.call(dygraph, ctx, area, dygraph)
      }
    }

    dygraph.updateOptions({ underlayCallback }, true)

    return {}
  }
}
