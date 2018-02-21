import Dygraphs from 'dygraphs'
import { dateTicker } from '../Ticker/DateWorkaround'

// https://github.com/danvk/dygraphs/pull/912
export default class DateTickerWorkaround {
  static toString = () => {
    return 'DateTickerWorkaround Plugin'
  }

  activate (dygraph) {
    const originalOptionsViewForAxis = dygraph.optionsViewForAxis_
    dygraph.optionsViewForAxis_ = (axis) => {
      const original = originalOptionsViewForAxis.call(dygraph, axis)

      if (axis !== 'x') {
        return original
      }

      return (opt) => {
        if (opt === 'ticker') {
          if (original.call(dygraph, opt) === Dygraphs.dateTicker) {
            return dateTicker
          }
        }

        return original.call(dygraph, opt)
      }
    }

    return { }
  }
}
