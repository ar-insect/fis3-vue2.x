var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    assetsSubDirectory: 'assets',
    assetsPublicPath: '/'
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'assets',
    assetsPublicPath: '/',
    proxyTable: {}
  }
}
