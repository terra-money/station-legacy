// DO NOT MOVE TO UNDER THE IMPORTS SECTION
// REACT-SCRIPTS NEEDS THIS ENVS
process.env.NODE_ENV = 'development'
process.env.REACT_APP_ENV = 'extension'

const webpack = require('webpack')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require('path')
const { mirrorFiles } = require('@ssen/mirror-files')

const reactScriptsWebpackConfig = require('react-scripts/config/webpack.config.js')
const extensionWebpackConfig = require('../extension/webpack.config')

const publicFolder = path.join(process.cwd(), './public')
const dist = path.join(process.cwd(), './out/extension')

// ---------------------------------------------
// react-app
// ---------------------------------------------
const appWebpackConfig = reactScriptsWebpackConfig('development')

for (const rule of appWebpackConfig.module.rules) {
  if (!rule.oneOf) continue
  
  for (const one of rule.oneOf) {
    if (
      one.loader &&
      one.loader.includes('babel-loader') &&
      one.options &&
      one.options.plugins
    ) {
      one.options.plugins = one
        .options
        .plugins
        .filter(plugin =>
          typeof plugin !== 'string' ||
          !plugin.includes('react-refresh')
        )
    }
  }
}

appWebpackConfig.plugins = appWebpackConfig
  .plugins
  .filter(plugin =>
    !(plugin instanceof webpack.HotModuleReplacementPlugin) &&
    !(plugin instanceof ReactRefreshPlugin)
  )

appWebpackConfig.output.path = dist

// ---------------------------------------------
// extension
// ---------------------------------------------
extensionWebpackConfig.output.path = dist

webpack([appWebpackConfig, extensionWebpackConfig]).watch({}, (err, stats) => {
  if (err) {
    console.error(err)
  }
  console.error(stats.toString({
    chunks: false,
    colors: true,
    hash: false,
    timings: false,
    entrypoints: false,
    builtAt: false,
    modules: false
  }))
})

mirrorFiles({
  filesDirsOrGlobs: [publicFolder],
  outDir: dist,
  ignored: /index.html$/
}).subscribe(({ type, file }) => {
  if (type !== 'undefined') {
    console.log(`FILE MIRRORING [${type.toUpperCase()}]: ${file}`)
  }
})