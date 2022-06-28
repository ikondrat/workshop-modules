const { createJestConfig } = require('@craco/craco')

const cracoConfig = require('./craco.config.js')
const jestConfig = createJestConfig(cracoConfig({ env: process.env.NODE_ENV }))

module.exports = jestConfig
