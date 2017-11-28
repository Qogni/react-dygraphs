export default class Normalize {
  constructor (options) {
    if (typeof options !== 'object' || options.ranges === undefined) {
      throw new Error('Normalize ranges must be provided')
    }

    this.notches = options.notches ? options.notches : 4
    this.ranges = options.ranges

    this.activate.bind(this)
  }

  activate (dygraph) {
    const ranges = this.ranges

    const rangeMap = dygraph.getOption('labels').slice(1).reduce((a, l, i) => {
      let min = ranges[i][0]
      let max = ranges[i][1]
      let mod = (max - min) / 100

      return { [l]: (y) => (y * mod) + min, ...a }
    }, {})

    const extractSeries = (rawData, seriesIndex, options) => {
      let min = ranges[seriesIndex - 1][0]
      let max = ranges[seriesIndex - 1][1]
      let newSeries = []

      for (let i = 0; i < rawData.length; i++) {
        newSeries.push([
          rawData[i][0], (((rawData[i][1] - min) * 100) / (max - min)),
        ])
      }

      return newSeries
    }

    const axes = dygraph.getOption('axes')

    axes.y.valueFormatter = (y, opts, seriesName) => {
      return rangeMap[seriesName](y)
    }

    axes.y.ticker = () => [...Array(this.notches + 1).keys()].map(n => {
      let value = (n / this.notches) * 100

      return {
        v: value,
        label: value,
      }
    })

    dygraph.updateOptions({ axes, valueRange: [0, 100] }, true)

    const predraw = (e) => { e.dygraph.dataHandler_.extractSeries = extractSeries }

    return { predraw }
  }
}

Normalize.toString = () => {
  return 'Normalize Plugin'
}
