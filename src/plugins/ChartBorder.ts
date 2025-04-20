import Dygraph, { type dygraphs } from '@qogni/dygraphs'

type UnderlayCallback = NonNullable<dygraphs.Options['underlayCallback']>

export default class ChartBorder implements dygraphs.DygraphsPlugin {
  static toString = () => {
    return 'ChartBorder Plugin'
  }

  activate = (dygraph: Dygraph) => {
    const originalCallback = dygraph.getOption('underlayCallback') as unknown as dygraphs.Options['underlayCallback']

    const underlayCallback: UnderlayCallback = function (ctx, area, dygraph) {
      if (originalCallback) {
        originalCallback(ctx, area, dygraph)
      }

      ctx.beginPath()
      ctx.strokeStyle = 'black'
      ctx.moveTo(area.x, area.y)
      ctx.lineTo(area.w + area.x, area.y)
      ctx.moveTo(area.w + area.x, area.y)
      ctx.lineTo(area.w + area.x, area.h)
      ctx.stroke()
    }

    dygraph.updateOptions({ underlayCallback }, true)

    return {}
  }
}
