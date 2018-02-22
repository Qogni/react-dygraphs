import { addEvent, removeEvent } from 'dygraphs/src/dygraph-utils'

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

  activate = (dygraph) => {
    this.handleVisibilityChange = (e) => {
      if (!document[crossHidden()]) {
        dygraph.updateOptions({}, false)
      }
    }

    addEvent(document, crossVisibilityChange(), this.handleVisibilityChange)
  }

  destroy = (e) => {
    removeEvent(document, crossVisibilityChange(), this.handleVisibilityChange)
  }
}
