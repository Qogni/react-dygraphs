import React from 'react'
import { render } from '@testing-library/react'
import { Dygraph } from '@src'

describe('Dygraph', () => {
  it('should be a function', () => {
    expect(Dygraph).to.be.a('function')
  })

  it('should be a React component', () => {
    expect(new Dygraph({})).to.be.an.instanceof(React.Component)
  })

  it('should render a div', () => {
    const rendered = render(<Dygraph />)
    expect(rendered.container.tagName).to.equal('DIV')
  })
})
