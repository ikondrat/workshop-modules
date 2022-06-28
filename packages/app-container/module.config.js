const getSharedDeps = require('../../config/webpack/module.shared.js')
const deps = require('./package.json').dependencies


module.exports = {
  name: "app_container",
  shared: getSharedDeps(deps)
}
