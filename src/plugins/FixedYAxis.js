export default class FixedYAxis {
  static toString = () => {
    return 'FixedYAxis Plugin'
  }

  activate (dygraph) {
    let valueRange = dygraph.getOption('valueRange')

    if (!valueRange) {
      throw new Error('No valueRange set')
    }

    const getExtremeYValues = () => valueRange
    const predraw = (e) => {
      let newRange = dygraph.getOption('valueRange')

      if (valueRange[0] !== newRange[0] ||
      valueRange[1] !== newRange[1]) {
        valueRange = newRange
      }

      e.dygraph.dataHandler_.getExtremeYValues = getExtremeYValues
    }

    // Default value of 0.1 will add 10% Y-axis padding
    dygraph.updateOptions({ yRangePad: 0 }, true)

    // Must override dataHandler.getExtremeYValues every predraw
    return { predraw }
  }
}
