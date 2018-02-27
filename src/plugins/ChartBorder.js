export default class ChartBorder {
  static toString = () => {
    return 'ChartBorder Plugin'
  }

  activate = (dygraph) => {
    const originalCallback = dygraph.getFunctionOption('underlayCallback')

    let underlayCallback = function (ctx, area, dygraph) {
      ctx.beginPath()
      ctx.strokeStyle = 'black'
      ctx.moveTo(area.x, area.y)
      ctx.lineTo(area.w, area.y)
      ctx.moveTo(area.w, area.y)
      ctx.lineTo(area.w, area.h)
      ctx.stroke()

      if (originalCallback) {
        originalCallback.call(this, ctx, area, dygraph)
      }
    }

    dygraph.updateOptions({ underlayCallback }, true)

    return {}
  }
}
