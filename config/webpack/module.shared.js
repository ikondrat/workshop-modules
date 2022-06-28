module.exports = (deps) => ({
  react: {
    singleton: true,
    requiredVersion: deps['react'],
  },
  'react-dom': {
    singleton: true,
    requiredVersion: deps['react-dom'],
  },
  'react-router': {
    singleton: true,
    requiredVersion: deps['react-router'],
  },
  'react-router-dom': {
    singleton: true,
    requiredVersion: deps['react-router-dom'],
  },
  'react-router': {
    singleton: true,
    requiredVersion: deps['react-router'],
  },
  'react-redux': {
    singleton: true,
    requiredVersion: deps['react-redux'],
  },
  '@crowdhouse/messages': {
    singleton: true,
    requiredVersion: deps['@crowdhouse/messages'],
  },
  'formik': {
    singleton: true,
    requiredVersion: deps['formik'],
  },
  'react-intl': {
    singleton: true,
    requiredVersion: deps['react-intl'],
  },
})
