import util from 'util'

const deepLog = thing => {
  console.log(util.inspect(thing, false, null))
}

export default deepLog