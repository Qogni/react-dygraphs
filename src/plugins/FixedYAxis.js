export default class FixedYAxis {
  activate (dygraph) {
    const valueRange = dygraph.getOption('valueRange')

    if (!valueRange) {
      throw new Error('No valueRange set')
    }

    const getExtremeYValues = () => valueRange
    const predraw = (e) => (e.dygraph.dataHandler_.getExtremeYValues = getExtremeYValues)

    // Default value of 0.1 will add 10% Y-axis padding
    dygraph.updateOptions({ yRangePad: 0 }, true)

    // Must override dataHandler.getExtremeYValues every predraw
    return { predraw }
  }
}

FixedYAxis.toString = () => {
  return 'FixedYAxis Plugin'
}
