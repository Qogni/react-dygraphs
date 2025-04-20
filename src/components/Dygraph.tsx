import React from 'react'
import Dygraphs from '@qogni/dygraphs'
import { ReactDygraphProps } from './DygraphProps'
import { useOptions } from './useOptions'

const Dygraph: React.FunctionComponent<ReactDygraphProps> = (props) => {
  const divRef = React.useRef<HTMLDivElement>(null)
  const [dygraph, setDygraph] = React.useState<Dygraphs | null>(null)

  const options = useOptions(props)

  React.useEffect(() => {
    if (dygraph !== null) {
      dygraph.updateOptions(options)
    }
  }, [options])

  React.useEffect(() => {
    if (divRef.current !== null) {
      setDygraph(new Dygraphs(divRef.current, props.data ?? [], options))
    }

    return () => {
      if (dygraph !== null) {
        dygraph.destroy()
        setDygraph(null)
      }
    }
  }, [divRef])

  return (
    <div
      ref={divRef}
      style={props.style}
    />
  )
}

export default Dygraph
