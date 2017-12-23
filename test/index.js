import ModuleDefaultComponent, {
  Dygraph,
  ChartBackground,
  ChartBorder,
  FixedYAxis,
  Normalize,
  Downsample,
  StickyEdges,
} from '../src'

describe('module entry point', () => {
  it('should be a function', () => {
    expect(ModuleDefaultComponent).to.be.a('function')
  })

  it('should be Dygraph', () => {
    expect(ModuleDefaultComponent).to.equal(Dygraph)
  })
})

describe('Plugins entry points', () => {
  it('ChartBackground should be a function', () => {
    expect(ChartBackground).to.be.a('function')
  })
  it('ChartBorder should be a function', () => {
    expect(ChartBorder).to.be.a('function')
  })
  it('FixedYAxis should be a function', () => {
    expect(FixedYAxis).to.be.a('function')
  })
  it('Normalize should be a function', () => {
    expect(Normalize).to.be.a('function')
  })
  it('Downsample should be a function', () => {
    expect(Downsample).to.be.a('function')
  })
  it('StickyEdges should be a function', () => {
    expect(StickyEdges).to.be.a('function')
  })
})
