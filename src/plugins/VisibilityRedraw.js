import { addEvent, removeEvent } from 'dygraphs/src/dygraph-utils'

/**
 * Attempts to fix Chrome canvas rendering issues when the window / tab
 * is inactive
 *
 * https://stackoverflow.com/questions/44156528/canvas-doesnt-repaint-when-tab-inactive-backgrounded-for-recording-webgl
 * https://bugs.chromium.org/p/chromium/issues/detail?id=639105
 */

const crossVisibilityChange = () => {
  if (typeof document.hidden !== 'undefined') {
    return 'visibilitychange'
  } else if (typeof document.msHidden !== 'undefined') {
    return 'msvisibilitychange'
  } else if (typeof document.webkitHidden !== 'undefined') {
    return 'webkitvisibilitychange'
  }
}

const crossHidden = () => {
  if (typeof document.hidden !== 'undefined') {
    return 'hidden'
  } else if (typeof document.msHidden !== 'undefined') {
    return 'msHidden'
  } else if (typeof document.webkitHidden !== 'undefined') {
    return 'webkitHidden'
  }
}

export default class VisibilityRedraw {
  static toString = () => {
    return 'VisibilityRedraw Plugin'
  }

  triggerRedraw = () => {
    this.dygraph.updateOptions({}, false)
  }

  handleVisibilityChange = (e) => {
    if (!document[crossHidden()]) {
      this.triggerRedraw()
    }
  }

  activate = (dygraph) => {
    this.dygraph = dygraph

    addEvent(window, 'focus', this.triggerRedraw)
    addEvent(document, crossVisibilityChange(), this.handleVisibilityChange)

    return { }
  }

  destroy = (e) => {
    removeEvent(window, 'focus', this.triggerRedraw)
    removeEvent(document, crossVisibilityChange(), this.handleVisibilityChange)
  }
}
