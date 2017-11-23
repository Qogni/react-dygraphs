import ModuleDefaultComponent, { Dygraph } from '../src'

describe('module entry point', function () {
  it('should be a function', function () {
    expect(ModuleDefaultComponent).to.be.a('function')
  })
  it('should be Dygraph', function () {
    expect(ModuleDefaultComponent).to.equal(Dygraph)
  })
})
