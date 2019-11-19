
/*
 * Functions to check the app environnement.
 * Use theme instead of checking directly
 * process.env;APP_ENV.
 * */
exports.inProduction = () => {
  return process.env.APP_ENV === 'prod'
}

exports.inLocalDev = () => {
  return process.env.APP_ENV === 'dev'
}

exports.inIntegration = () => {
  return process.env.APP_ENV === 'int'
}

exports.inTest = () => {
  return process.env.APP_ENV === 'test'
}
