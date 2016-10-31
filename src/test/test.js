import tape from 'tape'
import safeCss from '../safe-css'
import deepLog from '../deep-log'

tape('test div insertion', t => {
  const expected = {
    type: 'tag',
    name: 'div',
    attribs: { class: '__test_div__unique__' }
  }

  const output = safeCss('Simple')
  t.equals(output[0].children[0].type, expected.type, 'test tag added')
  t.equals(output[0].children[0].name, expected.name, 'test tag type ok')
  t.deepEquals(expected.attribs, output[0].children[0].attribs, 'test tag attribs ok')
  t.end()
})

tape('simple case', t => {
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

  const output = safeCss('Simple')

  t.deepEquals(output[0].css, expected[0].css, 'main div styling ok')
  t.deepEquals(output[0].children[0].css, expected[0].children[0].css, 'test div styling ok')
  t.end()
})