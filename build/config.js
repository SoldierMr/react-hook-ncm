const argv = require('yargs-parser')(process.argv.slice(4))
const APP_ENV = argv.env || 'dev'

const STATICDOMAIN = APP_ENV === 'prod' ? '.' : ''

const env = require('./env.json')
const oriEnv = env[APP_ENV]
Object.assign(oriEnv, {
    APP_ENV: APP_ENV
})

const defineEnv = {}
for (let k in oriEnv) {
    defineEnv[`process.env.${k}`] = JSON.stringify(oriEnv[k])
}

module.exports = {
    APP_ENV,
    defineEnv,
    assetsPublicPath: APP_ENV === 'dev' ? '/' : `${STATICDOMAIN}/`,
    assetsSubDirectory: '',
    _hash: APP_ENV === 'dev' ? 'hash' : 'chunkhash',
    sourceMap: APP_ENV === 'dev' ? 'eval-source-map' : APP_ENV === 'prod' ? 'source-map' : false,
    extractCss: APP_ENV !== 'dev',
    bundleAnalyzerReport: false
}