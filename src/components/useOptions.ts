import React from 'react'
import { ReactDygraphProps, splitProps } from './DygraphProps'
import { default as DygraphBase } from '@qogni/dygraphs'
import { getInteractionModelProxy } from '../proxy/InteractionModelProxy'
import { usePlugins } from './usePlugins'

export const useOptions = (inputProps: ReactDygraphProps) => {
  const props = React.useMemo(() => splitProps(inputProps), [inputProps])

  const plugins = usePlugins(props.extendedProps)

  return React.useMemo(() => {
    const { dygraphsProps } = props

    dygraphsProps.interactionModel = getInteractionModelProxy(
      dygraphsProps.interactionModel || DygraphBase.defaultInteractionModel
    )

    if (!dygraphsProps.plugins) {
      dygraphsProps.plugins = []
    }

    dygraphsProps.plugins.push(...plugins)

    dygraphsProps.labels = dygraphsProps.labels ?? []

    return dygraphsProps
  }, [props, plugins])
}
