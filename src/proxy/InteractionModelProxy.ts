// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxyHandler: ProxyHandler<any> = {
  get(target, prop) {
    let value

    switch (prop) {
      case 'mousedown':
      case 'touchstart':
      case 'touchmove':
      case 'touchend':
      case 'dblclick':
      case 'willDestroyContextMyself':
        value = Reflect.get(target, prop)
    }

    value = Reflect.get(target, prop)

    if (value instanceof Function) {
      return value.bind(target)
    }

    return value
  },
  set(target, prop, value) {
    switch (prop) {
      case 'willDestroyContextMyself':
        return Reflect.set(target, prop, value)
    }

    return Reflect.set(target, prop, value)
  },
}

export function getInteractionModelProxy<T>(target: T): T {
  return new Proxy(target, proxyHandler)
}
