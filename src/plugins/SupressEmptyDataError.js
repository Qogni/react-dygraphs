export default class SupressEmptyDataError {
  static toString = () => {
    return 'SupressEmptyDataError Plugin'
  }

  activate (dygraph) {
    const originalParseArray = dygraph.parseArray_
    dygraph.parseArray_ = (data) => {
      if (data.length === 0) {
        return null
      }

      return originalParseArray.call(dygraph, data)
    }

    return { }
  }
}
