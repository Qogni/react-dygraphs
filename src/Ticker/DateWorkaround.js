import * as utils from 'dygraphs/src/dygraph-utils'
import { Granularity } from 'dygraphs/src/dygraph-tickers'

export var dateTicker = (a, b, pixels, opts, dygraph, vals) => {
  const chosen = pickDateTickGranularity(a, b, pixels, opts)

  if (chosen >= 0) {
    return getDateAxis(a, b, chosen, opts, dygraph)
  } else {
    return []
  }
}

const DateField = {
  DATEFIELD_Y: 0,
  DATEFIELD_M: 1,
  DATEFIELD_D: 2,
  DATEFIELD_HH: 3,
  DATEFIELD_MM: 4,
  DATEFIELD_SS: 5,
  DATEFIELD_MS: 6,
  NUM_DATEFIELDS: 7,
}

const TICK_PLACEMENT = []
TICK_PLACEMENT[Granularity.MILLISECONDLY] = {datefield: DateField.DATEFIELD_MS, step: 1, spacing: 1}
TICK_PLACEMENT[Granularity.TWO_MILLISECONDLY] = {datefield: DateField.DATEFIELD_MS, step: 2, spacing: 2}
TICK_PLACEMENT[Granularity.FIVE_MILLISECONDLY] = {datefield: DateField.DATEFIELD_MS, step: 5, spacing: 5}
TICK_PLACEMENT[Granularity.TEN_MILLISECONDLY] = {datefield: DateField.DATEFIELD_MS, step: 10, spacing: 10}
TICK_PLACEMENT[Granularity.FIFTY_MILLISECONDLY] = {datefield: DateField.DATEFIELD_MS, step: 50, spacing: 50}
TICK_PLACEMENT[Granularity.HUNDRED_MILLISECONDLY] = {datefield: DateField.DATEFIELD_MS, step: 100, spacing: 100}
TICK_PLACEMENT[Granularity.FIVE_HUNDRED_MILLISECONDLY] = {datefield: DateField.DATEFIELD_MS, step: 500, spacing: 500}
TICK_PLACEMENT[Granularity.SECONDLY] = {datefield: DateField.DATEFIELD_SS, step: 1, spacing: 1000 * 1}
TICK_PLACEMENT[Granularity.TWO_SECONDLY] = {datefield: DateField.DATEFIELD_SS, step: 2, spacing: 1000 * 2}
TICK_PLACEMENT[Granularity.FIVE_SECONDLY] = {datefield: DateField.DATEFIELD_SS, step: 5, spacing: 1000 * 5}
TICK_PLACEMENT[Granularity.TEN_SECONDLY] = {datefield: DateField.DATEFIELD_SS, step: 10, spacing: 1000 * 10}
TICK_PLACEMENT[Granularity.THIRTY_SECONDLY] = {datefield: DateField.DATEFIELD_SS, step: 30, spacing: 1000 * 30}
TICK_PLACEMENT[Granularity.MINUTELY] = {datefield: DateField.DATEFIELD_MM, step: 1, spacing: 1000 * 60}
TICK_PLACEMENT[Granularity.TWO_MINUTELY] = {datefield: DateField.DATEFIELD_MM, step: 2, spacing: 1000 * 60 * 2}
TICK_PLACEMENT[Granularity.FIVE_MINUTELY] = {datefield: DateField.DATEFIELD_MM, step: 5, spacing: 1000 * 60 * 5}
TICK_PLACEMENT[Granularity.TEN_MINUTELY] = {datefield: DateField.DATEFIELD_MM, step: 10, spacing: 1000 * 60 * 10}
TICK_PLACEMENT[Granularity.THIRTY_MINUTELY] = {datefield: DateField.DATEFIELD_MM, step: 30, spacing: 1000 * 60 * 30}
TICK_PLACEMENT[Granularity.HOURLY] = {datefield: DateField.DATEFIELD_HH, step: 1, spacing: 1000 * 3600}
TICK_PLACEMENT[Granularity.TWO_HOURLY] = {datefield: DateField.DATEFIELD_HH, step: 2, spacing: 1000 * 3600 * 2}
TICK_PLACEMENT[Granularity.SIX_HOURLY] = {datefield: DateField.DATEFIELD_HH, step: 6, spacing: 1000 * 3600 * 6}
TICK_PLACEMENT[Granularity.DAILY] = {datefield: DateField.DATEFIELD_D, step: 1, spacing: 1000 * 86400}
TICK_PLACEMENT[Granularity.TWO_DAILY] = {datefield: DateField.DATEFIELD_D, step: 2, spacing: 1000 * 86400 * 2}
TICK_PLACEMENT[Granularity.WEEKLY] = {datefield: DateField.DATEFIELD_D, step: 7, spacing: 1000 * 604800}
TICK_PLACEMENT[Granularity.MONTHLY] = {datefield: DateField.DATEFIELD_M, step: 1, spacing: 1000 * 7200 * 365.2524} // 1e3 * 60 * 60 * 24 * 365.2524 / 12
TICK_PLACEMENT[Granularity.QUARTERLY] = {datefield: DateField.DATEFIELD_M, step: 3, spacing: 1000 * 21600 * 365.2524} // 1e3 * 60 * 60 * 24 * 365.2524 / 4
TICK_PLACEMENT[Granularity.BIANNUAL] = {datefield: DateField.DATEFIELD_M, step: 6, spacing: 1000 * 43200 * 365.2524} // 1e3 * 60 * 60 * 24 * 365.2524 / 2
TICK_PLACEMENT[Granularity.ANNUAL] = {datefield: DateField.DATEFIELD_Y, step: 1, spacing: 1000 * 86400 * 365.2524} // 1e3 * 60 * 60 * 24 * 365.2524 * 1
TICK_PLACEMENT[Granularity.DECADAL] = {datefield: DateField.DATEFIELD_Y, step: 10, spacing: 1000 * 864000 * 365.2524} // 1e3 * 60 * 60 * 24 * 365.2524 * 10
TICK_PLACEMENT[Granularity.CENTENNIAL] = {datefield: DateField.DATEFIELD_Y, step: 100, spacing: 1000 * 8640000 * 365.2524} // 1e3 * 60 * 60 * 24 * 365.2524 * 100

/**
 * Determine the correct granularity of ticks on a date axis.
 *
 * @param {number} a Left edge of the chart (ms)
 * @param {number} b Right edge of the chart (ms)
 * @param {number} pixels Size of the chart in the relevant dimension (width).
 * @param {function(string):*} opts Function mapping from option name -&gt; value.
 * @return {number} The appropriate axis granularity for this chart. See the
 *     enumeration of possible values in dygraph-tickers.js.
 */
const pickDateTickGranularity = (a, b, pixels, opts) => {
  const pixelsPerTick = /** @type{number} */(opts('pixelsPerLabel'))
  for (let i = 0; i < Granularity.NUM_GRANULARITIES; i++) {
    const numTicks = numDateTicks(a, b, i)
    if (pixels / numTicks >= pixelsPerTick) {
      return i
    }
  }
  return -1
}

const numDateTicks = (startTime, endTime, granularity) => {
  const spacing = TICK_PLACEMENT[granularity].spacing
  return Math.round(1.0 * (endTime - startTime) / spacing)
}

export var getDateAxis = function (startTime, endTime, granularity, opts, dg) {
  const formatter = /** @type{AxisLabelFormatter} */(
    opts('axisLabelFormatter'))
  const utc = opts('labelsUTC')
  const accessors = utc ? utils.DateAccessorsUTC : utils.DateAccessorsLocal

  const datefield = TICK_PLACEMENT[granularity].datefield
  const step = TICK_PLACEMENT[granularity].step
  const spacing = TICK_PLACEMENT[granularity].spacing

  const startDate = new Date(startTime)
  const dateArray = []
  dateArray[DateField.DATEFIELD_Y] = utils.DateAccessorsUTC.getFullYear(startDate)
  dateArray[DateField.DATEFIELD_M] = utils.DateAccessorsUTC.getMonth(startDate)
  dateArray[DateField.DATEFIELD_D] = utils.DateAccessorsUTC.getDate(startDate)
  dateArray[DateField.DATEFIELD_HH] = utils.DateAccessorsUTC.getHours(startDate)
  dateArray[DateField.DATEFIELD_MM] = utils.DateAccessorsUTC.getMinutes(startDate)
  dateArray[DateField.DATEFIELD_SS] = utils.DateAccessorsUTC.getSeconds(startDate)
  dateArray[DateField.DATEFIELD_MS] = utils.DateAccessorsUTC.getMilliseconds(startDate)

  let startDateOffset = dateArray[datefield] % step
  if (granularity === Granularity.WEEKLY) {
    // This will put the ticks on Sundays.
    startDateOffset = accessors.getDay(startDate)
  }

  dateArray[datefield] -= startDateOffset
  for (let df = datefield + 1; df < DateField.NUM_DATEFIELDS; df++) {
    // The minimum value is 1 for the day of month, and 0 for all other fields.
    dateArray[df] = (df === DateField.DATEFIELD_D) ? 1 : 0
  }

  const ticks = []
  let tickDate = utils.DateAccessorsUTC.makeDate.apply(null, dateArray)
  let tickTime = tickDate.getTime()

  if (granularity <= Granularity.HOURLY) {
    if (tickTime < startTime) {
      tickTime += spacing
      tickDate = new Date(tickTime)
    }
    while (tickTime <= endTime) {
      ticks.push({ v: tickTime,
        label: formatter.call(dg, tickDate, granularity, opts, dg),
      })
      tickTime += spacing
      tickDate = new Date(tickTime)
    }
  } else {
    if (tickTime < startTime) {
      dateArray[datefield] += step
      tickDate = utils.DateAccessorsUTC.makeDate.apply(null, dateArray)
      tickTime = tickDate.getTime()
    }
    while (tickTime <= endTime) {
      if (granularity >= Granularity.DAILY ||
        accessors.getHours(tickDate) % step === 0) {
        ticks.push({ v: tickTime,
          label: formatter.call(dg, tickDate, granularity, opts, dg),
        })
      }
      dateArray[datefield] += step
      tickDate = utils.DateAccessorsUTC.makeDate.apply(null, dateArray)
      tickTime = tickDate.getTime()
    }
  }
  return ticks
}
