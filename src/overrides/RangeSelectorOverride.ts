import Dygraph, { dygraphs } from '@qogni/dygraphs'

function isRangeSelectorPlugin(plugin: dygraphs.DygraphsFunctionPlugin): plugin is dygraphs.RangeSelectorPlugin {
  return plugin.prototype.toString() === 'RangeSelector Plugin'
    && Object.prototype.hasOwnProperty.call(plugin.prototype, 'computeCombinedSeriesAndLimits_')
}

export function overrideRangeSelector(): void {
  const rangeSelectorPlugin = Dygraph.PLUGINS.find(isRangeSelectorPlugin)

  if (rangeSelectorPlugin === undefined) {
    return
  }

  const originalFunction = rangeSelectorPlugin.prototype.computeCombinedSeriesAndLimits_

  rangeSelectorPlugin.prototype.computeCombinedSeriesAndLimits_ = function () {
    if (this.dygraph_.numColumns() === 0) {
      return { data: [], yMin: 0, yMax: 1 }
    }

    return originalFunction.call(this)
  }
}
