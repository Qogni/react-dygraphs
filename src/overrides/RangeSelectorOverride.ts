import Dygraphs from '@qogni/dygraphs'

interface RangeSelectorPrototype {
  dygraph_: Dygraphs
  computeCombinedSeriesAndLimits_(): { data: unknown[], yMin: number, yMax: number }
}

type RangeSelectorPlugin = {
  prototype: RangeSelectorPrototype
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRangeSelectorPlugin(plugin: any): plugin is RangeSelectorPlugin {
  return Object.prototype.hasOwnProperty.call(plugin.prototype, 'computeCombinedSeriesAndLimits_')
}

export function overrideRangeSelector(): void {
  const rangeSelectorIndex = Dygraphs.PLUGINS.findIndex(isRangeSelectorPlugin)

  console.log(rangeSelectorIndex)
  if (rangeSelectorIndex < 0) {
    return
  }

  const plugin: RangeSelectorPlugin = Dygraphs.PLUGINS[rangeSelectorIndex]

  if (plugin.prototype.computeCombinedSeriesAndLimits_) {
    const originalFunction = plugin.prototype.computeCombinedSeriesAndLimits_

    plugin.prototype.computeCombinedSeriesAndLimits_ = function () {
      if (this.dygraph_.numColumns() === 0) {
        return { data: [], yMin: Number.MAX_VALUE, yMax: -Number.MAX_VALUE }
      }

      return originalFunction.call(this)
    }
  }
}
