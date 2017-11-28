import ModuleDefaultComponent, { Dygraph, FixedYAxis } from '../src'

describe('module entry point', () => {
  it('should be a function', () => {
    expect(ModuleDefaultComponent).to.be.a('function')
  })


  it('should be Dygraph', () => {
    expect(ModuleDefaultComponent).to.equal(Dygraph)
  })
})

describe('FixedYAxis entry point', () => {
  it('should be a function', () => {
    expect(FixedYAxis).to.be.a('function')
  })
})
