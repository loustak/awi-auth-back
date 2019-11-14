
exports.inProd = () => {
  return process.env.NODE_ENV === 'prod'
}

exports.inDev = () => {
  return process.env.NODE_ENV === 'dev'
}

exports.inTest = () => {
  return process.env.NODE_ENV === 'test'
}