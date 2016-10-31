import fs from 'fs'
import React, { Component } from 'react'
import ReactDOM from 'react-dom/server'
import parseHtml from './parse-html'
import css from 'css'
import deepLog from './deep-log'
import merge from 'merge'
import { CssSelectorParser } from 'css-selector-parser'

const check = (testName) => {
  const TestComponent = require('./test/fixtures/' + testName).default

  function seteq (left, right) {
    if (left !== right) {
      if (!left || !right) { return false }
      for (const item of left) {
        if (!right.has(item)) { return false }
      }
    }
    return true
  }

  // parse the CSS
  const inputCss = fs.readFileSync('./build/test/fixtures/' + testName + '.css', 'utf-8')
  const options = { silent: false, source: testName + '.css' }
  const parsedCss = css.parse(inputCss, options)

  // create the component's DOM tree
  const rawHtml = ReactDOM.renderToStaticMarkup(<TestComponent label='Done' onClick={ _ => {} } />)
  const domTree = parseHtml(rawHtml)

  // inject test divs into each element
  const testDiv = {
    type: 'tag',
    name: 'div',
    attribs: {
      class: '__test_div__unique__'
    }
  }
  const injectTestDivWalk = (branch) => {
    // console.log(branch)
    branch.forEach(node => {
      if (!node.children) {
        node.children = [ testDiv ]
        return
      } else {
        injectTestDivWalk(node.children)
      }
    })
  }
  injectTestDivWalk(domTree)

  // deepLog(domTree)

  // create a CSS selector parser
  const selectorParser = new CssSelectorParser()
  selectorParser.registerNestingOperators('>', '+', '~')
  selectorParser.registerAttrEqualityMods('^', '$', '*', '~')
  selectorParser.enableSubstitutes()

  // create the function that we'll use to recurse through the DOM tree
  const walk = (parent, branch, rule) => { // branch is a DOM element, rule is a CSS rule
    rule.selectors.forEach(selector => {
      const parsedSelector = selectorParser.parse(selector)

      branch.forEach(node => { // node is a virtual DOM node
        if (node.attribs && node.attribs.class) {
          const cssClassNames = new Set(parsedSelector.rule.classNames)
          const htmlClassNames = new Set(node.attribs.class.split(' '))
          if (!parsedSelector.rule.rule) { // nested rule
            // console.log(cssClassNames)
            // console.log(htmlClassNames)

            if (seteq(cssClassNames, htmlClassNames)) {
              if (!node.css) {
                node.css = []
              }

              rule.declarations.forEach(declaration => {
                node.css = merge(true, node.css, { [declaration.property]: declaration.value })
              })
            }
          } else { // we're in a nested rule
            // does the rule match?
            // console.log('parsedSelector.rule:', parsedSelector.rule)
            const parentHtmlClassNames = parent && parent.attribs ? new Set(parent.attribs.class.split(' ')) : null
            // console.log('parent.attribs.class:', parentHtmlClassNames)

            // parsedSelector.rule: {
            //   classNames: [ 'Simple' ],
            //   type: 'rule',
            //   rule: {
            //     tagName: '*',
            //     nestingOperator: '>',
            //     type: 'rule'
            //   }
            // }
            // rule.declarations.forEach(declaration => {
            //   node.css = merge(true, node.css, { [declaration.property]: declaration.value })
            // })


            // console.log('htmlClassNames:', htmlClassNames)
          }
        }

        if (!node.children) {
          return
        } else {
          walk(node, node.children, rule)
        }
      })
    })
  }

  // do the actual recursion through the DOM tree, applying the rule to each element
  parsedCss.stylesheet.rules.forEach(rule => {
    walk(null, domTree, rule)
  })

  return domTree
}

export default check