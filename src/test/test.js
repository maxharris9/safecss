import tape from 'tape'
import safeCss from '../safe-css'
import deepLog from '../deep-log'

const expected = [ {
  type: 'tag',
  name: 'span',
  attribs: { class: 'Simple' },
  children: [ {
    type: 'tag',
    name: 'div',
    attribs: { class: '__test_div__unique__' },
    css: {
      cursor: 'initial',
      border: 'initial',
      background: 'initial',
      margin: 'initial',
      padding: 'initial',
      color: 'initial',
      fill: 'initial',
      'text-transform': 'initial',
      float: 'initial'
    }
  } ],
  css: {
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    margin: '0px',
    padding: '0px',
    color: 'var(--color-light1)',
    fill: 'var(--color-light1)',
    'text-transform': 'uppercase',
    float: 'right'
   } } ]

tape('div insertion', t => {
  const child = expected[0].children[0]

  const output = safeCss('Simple')

  t.equals(output[0].children[0].type, child.type, 'test tag added')
  t.equals(output[0].children[0].name, child.name, 'test tag type ok')
  t.deepEquals(output[0].children[0].attribs, child.attribs, 'test tag attribs ok')
  t.end()
})

tape('styling on parent and child', t => {
  const parent = expected[0]
  const testDiv = expected[0].children[0]

  const output = safeCss('Simple')

  t.deepEquals(output[0].css, parent.css, 'main div styling ok')
  t.deepEquals(output[0].children[0].css, testDiv.css, 'test div styling ok')
  t.end()
})