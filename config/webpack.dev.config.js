var configs = require('./webpack.base.config'),
    path = require('path'),
    webpack = require('webpack');
var merge = require('webpack-merge')
var plugins=require('./plugins.js')
configs.forEach(function(config){
  config.plugins = config.plugins.concat(plugins.dev(config.language))
  config.devtool = 'eval-source-map'
  config.devServer = {
    noInfo: true,
    hot: true,
    inline: true,
    outputPath: path.join(__dirname, 'dist'),
    proxy: {
      '/sg-demo': {
        target: 'http://127.0.0.1:9091',
        secure: false,
        changeOrigin: true,
        host: ""
      }      
    }
  }
  config = merge(config, {
    plugins: [
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
      // https://github.com/ampedandwired/html-webpack-plugin
    ]
  })
})


module.exports = configs
