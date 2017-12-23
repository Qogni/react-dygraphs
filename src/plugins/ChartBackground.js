export default class ChartBackground {
  constructor (color = '#fff') {
    this.color = color
  }

  static toString = () => {
    return 'ChartBackground Plugin'
  }

  activate = (dygraph) => {
    const color = this.color
    const originalCallback = dygraph.getFunctionOption('underlayCallback')

    let underlayCallback = function (ctx, area, dygraph) {
      ctx.fillStyle = color
      ctx.fillRect(area.x, area.y, area.w, area.h)

      if (originalCallback) {
        originalCallback.call(this, ctx, area, dygraph)
      }
    }

    dygraph.updateOptions({ underlayCallback }, true)

    return {}
  }
}
