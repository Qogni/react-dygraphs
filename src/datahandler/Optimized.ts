import Dygraphs, { dygraphs } from '@qogni/dygraphs'

const parseFloat = (val: number|null) => val === null ? NaN : val

// https://github.com/danvk/dygraphs/pull/896
export default class OptimizedDataHandler extends Dygraphs.DataHandlers.DefaultHandler {
  seriesToPoints(series: [number, number][], setName: string, boundaryIdStart: number): dygraphs.Point[] {
    const points: dygraphs.Point[] = []

    for (let i = 0; i < series.length; ++i) {
      points.push({
        x: NaN,
        y: NaN,
        xval: parseFloat(series[i][0]),
        yval: series[i][1] === null ? undefined : parseFloat(series[i][1]),
        name: setName,
        idx: i + boundaryIdStart,
        canvasx: NaN,
        canvasy: NaN,
      })
    }

    this.onPointsCreated_(series, points)

    return points
  }
}
