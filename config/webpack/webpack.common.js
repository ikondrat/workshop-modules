const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const webpack = require("webpack");
const devMode = process.env.REACT_APP_ENV !== "production";
const postcssNormalize = require("postcss-normalize");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const CopyPlugin = require("copy-webpack-plugin");

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const chunkPattern = "[name].[chunkhash]";

// common function to get style loaders
const getStyleLoaders = (srcDir, cssOptions, preProcessor) => {
  // const publicURL = process.env.PUBLIC_URL
  const loaders = [
    devMode && require.resolve("style-loader"),
    !devMode && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: (resourcePath, context) => {
          return path.relative(path.dirname(resourcePath), context) + "/";
        },
      },
    },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve("postcss-loader"),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009",
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: devMode,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: devMode,
          root: srcDir,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: devMode,
        },
      }
    );
  }
  return loaders;
};

module.exports = ({
  sourceDirectory,
  targetDirectory,
  moduleFederationConfig,
  injectHTML = true,
  copyPublicFolder = true,
  babelPlugins = []
}) => {
  const plugins = [
    new webpack.DefinePlugin({
      // pass react env
      "process.env": JSON.stringify(
        Object.fromEntries(
          Object.entries(process.env).filter((entry) =>
            entry[0].startsWith("REACT")
          )
        )
      ),
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `${chunkPattern}.css`,
      chunkFilename: `${chunkPattern}.css`,
    }),
  ];

  if (injectHTML) {
    plugins.push(
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        inject: "body",
        envs: process.env,
      })
    );
  }

  if (copyPublicFolder) {
    plugins.push(
      new CopyPlugin({
        patterns: [
          {
            context: "./public/",
            from: "**/*",
            force: true,
            globOptions: {
              dot: true,
              gitignore: true,
              ignore: ["**/index.html"],
            },
          },
        ],
      })
    );
  }

  if (moduleFederationConfig) {
    plugins.push(new ModuleFederationPlugin(moduleFederationConfig));
  }

  return {
    entry: "./src/index.tsx",
    mode: "production",
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      modules: [sourceDirectory, "node_modules"],
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(process.cwd(), '.cache', 'webpack'),
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ]
    },
    output: {
      filename: `${chunkPattern}.js`,
      path: targetDirectory,
      clean: true,
    },
    module: {
      rules: [
        {
          test: /bootstrap\.tsx$/,
          loader: "bundle-loader",
          options: {
            lazy: true,
            name: `${chunkPattern}.js`,
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            cacheCompression: false,
            cacheDirectory: path.resolve(process.cwd(), '.cache', 'babel'),
            presets: [
              "@babel/preset-env",
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
              "@babel/preset-typescript",
            ],
            plugins: [
              [
                "inline-react-svg",
                {
                  svgo: false,
                },
              ],
              ...babelPlugins
            ],
          },
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader",
        },
        {
          test: /\.svg$/,
          use: ["@svgr/webpack?-svgo,+titleProp,+ref![path]", "url-loader"],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: process.env.IMAGE_INLINE_SIZE_LIMIT || "10000",
              },
            },
          ],
          type: "javascript/auto",
        },
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        // In production, we use MiniCSSExtractPlugin to extract that CSS
        // to a file, but in development "style" loader enables hot editing
        // of CSS.
        // By default we support CSS Modules with the extension .module.css
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders(sourceDirectory, {
            importLoaders: 1,
            sourceMap: devMode,
          }),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: cssModuleRegex,
          use: getStyleLoaders(sourceDirectory, {
            importLoaders: 1,
            sourceMap: devMode,
            modules: {
              getLocalIdent: getCSSModuleLocalIdent,
            },
          }),
        },
        // Opt-in support for SASS (using .scss or .sass extensions).
        // By default we support SASS Modules with the
        // extensions .module.scss or .module.sass
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: getStyleLoaders(
            sourceDirectory,
            {
              importLoaders: 3,
              sourceMap: devMode,
            },
            "sass-loader"
          ),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Adds support for CSS Modules, but using SASS
        // using the extension .module.scss or .module.sass
        {
          test: sassModuleRegex,
          use: getStyleLoaders(
            sourceDirectory,
            {
              importLoaders: 3,
              sourceMap: devMode,
              modules: {
                getLocalIdent: getCSSModuleLocalIdent,
              },
            },
            "sass-loader"
          ),
        },
      ],
    },
    plugins,
  };
};
