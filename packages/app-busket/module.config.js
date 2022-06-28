const getSharedDeps = require('../../config/webpack/module.shared.js')
const deps = require('./package.json').dependencies

module.exports = {
  name: 'app_busket',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App',
  },
  shared: getSharedDeps(deps),
}
