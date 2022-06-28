const path = require("path");
const merge = require("webpack-merge");
const getWebpackConfig = require("../../config/webpack/webpack.common.js");
const moduleFederationConfig = require("./module.config.js");

module.exports = merge(
  getWebpackConfig({
    sourceDirectory: path.resolve(__dirname, "src"),
    targetDirectory: path.resolve(__dirname, process.env.DIST),
    moduleFederationConfig,
    babelPlugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          "absoluteRuntime": false,
          "corejs": false,
          "helpers": true,
          "regenerator": true
        }
      ]
    ]
  }),
  {
    mode: "development",
    devServer: {
      open: true,
      historyApiFallback: true,
      contentBase: path.join(__dirname, process.env.DIST),
      port: process.env.PORT,
    },
    output: {
      publicPath: "auto",
    },
  }
);
