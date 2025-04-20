import Dygraph, { type dygraphs } from '@qogni/dygraphs'

type UnderlayCallback = NonNullable<dygraphs.Options['underlayCallback']>

export default class ChartBackground implements dygraphs.DygraphsPlugin {
  constructor(private readonly color = '#fff') {
  }

  static toString = () => {
    return 'ChartBackground Plugin'
  }

  activate = (dygraph: Dygraph) => {
    const color = this.color
    const originalCallback = dygraph.getOption('underlayCallback') as unknown as dygraphs.Options['underlayCallback']

    const underlayCallback: UnderlayCallback = function (ctx, area, dygraph) {
      if (originalCallback) {
        originalCallback(ctx, area, dygraph)
      }
      ctx.fillStyle = color
      ctx.fillRect(area.x, area.y, area.w, area.h)
    }

    dygraph.updateOptions({ underlayCallback }, true)

    return {}
  }
}
