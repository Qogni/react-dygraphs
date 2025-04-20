import { dygraphs } from '@qogni/dygraphs'

interface ExtendedProps {
  chartBackground?: boolean | string
  chartBorder?: boolean
  constrainDateWindow?: boolean
  dayMarker?: boolean | {
    color?: string
    dateFormatter?: (date: Date) => string
    font?: string
    fontSize?: number
  }
  downsample?: boolean | {
    visibleThreshold?: number
    invisibleThreshold?: number
  }
  fixedYAxis?: boolean
  normalize?: {
    notches?: number
    ranges: Array<Array<number>>
  }
  onDateWindowChanged?: (dateWindow: [Date, Date]) => void
  stickyEdges?: boolean | {
    left?: boolean
    right?: boolean
  }
  style?: object
}

const RENAMED_PROPS = {
  onAnnotationClick: 'annotationClickHandler',
  onAnnotationDblClick: 'annotationDblClickHandler',
  onAnnotationMouseOut: 'annotationMouseOutHandler',
  onAnnotationMouseOver: 'annotationMouseOverHandler',
  onClick: 'clickCallback',
  onHighlight: 'highlightCallback',
  onPointClick: 'pointClickCallback',
  onUnhighlight: 'unhighlightCallback',
  onZoom: 'zoomCallback',
} as const

type RenamedProps = {
  [key in keyof typeof RENAMED_PROPS]?: dygraphs.Options[typeof RENAMED_PROPS[key]]
}

type SameNameProps = Omit<dygraphs.Options, typeof RENAMED_PROPS[keyof typeof RENAMED_PROPS]>

export type ReactDygraphProps = ExtendedProps & SameNameProps & RenamedProps & { data?: dygraphs.Data }

const EXTENDED_PROPS = [
  'chartBackground',
  'chartBorder',
  'constrainDateWindow',
  'dayMarker',
  'downsample',
  'fixedYAxis',
  'normalize',
  'onDateWindowChanged',
  'stickyEdges',
  'style',
]

function isRenamedProp(prop: string): prop is keyof RenamedProps {
  return prop in RENAMED_PROPS
}

function isExtendedProp(prop: string): prop is keyof ExtendedProps {
  return prop in EXTENDED_PROPS
}

export function splitProps(props: ReactDygraphProps) {
  const extendedProps: ExtendedProps = {}
  const dygraphsProps: dygraphs.Options = {}

  for (const prop in props) {
    if (prop === 'data') {
      continue
    }

    if (isExtendedProp(prop)) {
      // @ts-expect-error Don't know wtf is this
      extendedProps[prop] = props[prop]
    } else {
      if (isRenamedProp(prop)) {
        // @ts-expect-error Don't know wtf is this
        dygraphsProps[RENAMED_PROPS[prop]] = props[prop]
      } else {
        // @ts-expect-error Don't know wtf is this
        dygraphsProps[prop] = props[prop]
      }
    }
  }

  return { extendedProps, dygraphsProps, data: props.data }
}
