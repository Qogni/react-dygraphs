export default class ChartBorder {
  static toString = () => {
    return 'ChartBorder Plugin'
  }

  activate = (dygraph) => {
    const originalCallback = dygraph.getFunctionOption('underlayCallback')

    let underlayCallback = function (ctx, area, dygraph) {
      ctx.strokeStyle = 'black'
      ctx.strokeRect(area.x, area.y, area.w, area.h)

      if (originalCallback) {
        originalCallback.call(this, ctx, area, dygraph)
      }
    }

    dygraph.updateOptions({ underlayCallback }, true)

    return {}
  }
}
