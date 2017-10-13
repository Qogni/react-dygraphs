import { Dygraph } from '../../src'
import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'

describe('Dygraph', function () {
  it('should be a function', function () {
    expect(Dygraph).to.be.a('function')
  })
  it('should be a React component', function () {
    expect(new Dygraph()).to.be.an.instanceof(React.Component)
  })
  it('should render a div', function () {
    const renderer = new ShallowRenderer()
    renderer.render(<Dygraph data={[]} />)
    const result = renderer.getRenderOutput()
    expect(result.type).to.equal('div')
  })
})
