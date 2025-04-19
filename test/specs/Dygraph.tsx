import React from 'react'
import * as ShallowRenderer from 'react-test-renderer/shallow'
import { Dygraph } from '@src'

describe('Dygraph', () => {
  it('should be a function', () => {
    expect(Dygraph).to.be.a('function')
  })

  it('should be a React component', () => {
    expect(new Dygraph({})).to.be.an.instanceof(React.Component)
  })

  it('should render a div', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<Dygraph data={[]} />)
    const result = renderer.getRenderOutput()
    expect(result.type).to.equal('div')
  })
})
