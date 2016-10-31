import htmlParser from 'htmlparser'

const parseHtml = (rawHtml) => {
  const handler = new htmlParser.DefaultHandler((error, dom) => {
    if (error) {
      // console.error(error)
    } else {
      // console.log('parsing done')
    }
  },
  { verbose: false }
)

  const parser = new htmlParser.Parser(handler)
  parser.parseComplete(rawHtml)
  return handler.dom
}

export default parseHtml