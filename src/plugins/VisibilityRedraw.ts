import Dygraph, { dygraphs } from '@qogni/dygraphs'

/**
 * Attempts to fix Chrome canvas rendering issues when the window / tab
 * is inactive
 *
 * https://stackoverflow.com/questions/44156528/canvas-doesnt-repaint-when-tab-inactive-backgrounded-for-recording-webgl
 * https://bugs.chromium.org/p/chromium/issues/detail?id=639105
 */
export default class VisibilityRedraw implements dygraphs.DygraphsPlugin {
  static toString = () => {
    return 'VisibilityRedraw Plugin'
  }

  private dygraph?: Dygraph

  triggerRedraw = () => {
    if (this.dygraph === undefined) {
      return
    }

    this.dygraph.updateOptions({}, false)
  }

  handleVisibilityChange = () => {
    if (!document['hidden']) {
      this.triggerRedraw()
    }
  }

  activate = (dygraph: Dygraph) => {
    this.dygraph = dygraph

    window.addEventListener('focus', this.triggerRedraw)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)

    return { }
  }

  destroy = (e: unknown) => {
    window.removeEventListener('focus', this.triggerRedraw)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }
}
