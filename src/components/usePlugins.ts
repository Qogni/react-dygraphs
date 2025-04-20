import React from 'react'
import { ReactDygraphsExtendedProps } from './DygraphProps'
import SupressEmptyDataError from '../plugins/SupressEmptyDataError'
import VisibilityRedraw from '../plugins/VisibilityRedraw'
import DayMarker from '../plugins/DayMarker'
import ChartBorder from '../plugins/ChartBorder'
import ChartBackground from '../plugins/ChartBackground'
import Normalize from '../plugins/Normalize'
import Downsample from '../plugins/Downsample'
import FixedYAxis from '../plugins/FixedYAxis'
import StickyEdges from '../plugins/StickyEdges'
import ConstrainDateWindow from '../plugins/ConstrainDateWindow'

export const usePlugins = (extendedProps: ReactDygraphsExtendedProps) => {
  const [normalize, setNormalize] = React.useState<Normalize | null>(null)
  const [stickyEdges, setStickyEdges] = React.useState<StickyEdges | null>(null)

  const alwaysOnPlugins = React.useMemo(() => {
    return [new SupressEmptyDataError(), new VisibilityRedraw()]
  }, [])

  const simplePlugins = React.useMemo(() => {
    const plugins = []

    if (extendedProps.dayMarker) {
      plugins.push(new DayMarker())
    }

    if (extendedProps.chartBorder) {
      plugins.push(new ChartBorder())
    }

    if (extendedProps.fixedYAxis) {
      plugins.push(new FixedYAxis())
    }

    if (extendedProps.constrainDateWindow) {
      plugins.push(new ConstrainDateWindow())
    }

    return plugins
  }, [extendedProps.dayMarker, extendedProps.chartBorder, extendedProps.fixedYAxis, extendedProps.constrainDateWindow])

  React.useEffect(() => {
    if (normalize !== null) {
      normalize.updateOptions(extendedProps.normalize)
    } else if (extendedProps.normalize) {
      setNormalize(new Normalize(extendedProps.normalize))
    }
  }, [extendedProps.normalize])

  const chartBackground = React.useMemo(() => {
    if (extendedProps.chartBackground) {
      if (typeof extendedProps.chartBackground === 'boolean') {
        return new ChartBackground()
      }

      return new ChartBackground(extendedProps.chartBackground)
    }
  }, [extendedProps.chartBackground])

  const downSample = React.useMemo(() => {
    if (extendedProps.downsample) {
      return new Downsample(extendedProps.downsample)
    }
  }, [extendedProps.downsample])

  React.useEffect(() => {
    if (stickyEdges !== null && extendedProps.stickyEdges !== undefined) {
      stickyEdges.updateOptions(extendedProps.stickyEdges)
    } else if (extendedProps.stickyEdges) {
      setStickyEdges(new StickyEdges(extendedProps.stickyEdges))
    }
  }, [extendedProps.stickyEdges])

  return React.useMemo(() => {
    return [
      ...alwaysOnPlugins,
      ...simplePlugins,
      normalize,
      chartBackground,
      downSample,
      stickyEdges,
    ].filter(plugin => plugin !== undefined && plugin !== null)
  }, [alwaysOnPlugins, simplePlugins, normalize, chartBackground, downSample, stickyEdges])
}
