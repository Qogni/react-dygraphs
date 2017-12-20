const getRangeMap = (dygraph, ranges) => dygraph.getOption('labels').slice(1).reduce((a, l, i) => {
  const min = +ranges[i][0]
  const max = +ranges[i][1]
  const normalizeRatio = 100 / (max - min)
  const formatRatio = (max - min) / 100

  return {
    [l]: {
      normalize: (y) => ((y - min) * normalizeRatio),
      formatValue: (y) => (y * formatRatio) + min,
    },
    ...a,
  }
}, {})

export default class Normalize {
  static toString = () => {
    return 'Normalize Plugin'
  }

  constructor (options) {
    this.updateOptions(options)
  }

  updateOptions = (options) => {
    if (typeof options !== 'object' || options.ranges === undefined) {
      throw new Error('Normalize ranges must be provided')
    }

    this.notches = options.notches ? options.notches : 4
    this.ranges = options.ranges

    if (this.dygraph) {
      this.updateRangeMap()
    }
  }

  updateRangeMap = () => {
    this.rangeMap = getRangeMap(this.dygraph, this.ranges)
  }

  activate = (dygraph) => {
    this.dygraph = dygraph
    this.updateRangeMap()
    const $this = this

    const seriesToPoints = function (series, setName, boundaryIdStart) {
      const points = []

      for (let i = 0; i < series.length; ++i) {
        points.push({
          x: NaN,
          y: NaN,
          xval: series[i][0] === null ? null : series[i][0],
          yval: series[i][1] === null ? null : $this.rangeMap[setName].normalize(series[i][1]),
          name: setName, // TODO(danvk): is this really necessary?
          idx: i + boundaryIdStart,
          canvasx: NaN,
          canvasy: NaN,
        })
      }

      this.onPointsCreated_(series, points)
      return points
    }

    const axes = dygraph.getOption('axes')

    axes.y.valueFormatter = (y, opts, seriesName) => {
      return $this.rangeMap[seriesName].formatValue(y)
    }

    axes.y.ticker = () => [...Array(this.notches + 1).keys()].map(n => {
      const value = (n / this.notches) * 100

      return {
        v: value,
        label: value,
      }
    })

    dygraph.updateOptions({ axes, valueRange: [0, 100] }, true)

    const predraw = (e) => { e.dygraph.dataHandler_.seriesToPoints = seriesToPoints.bind(e.dygraph.dataHandler_) }

    return { predraw }
  }
}
