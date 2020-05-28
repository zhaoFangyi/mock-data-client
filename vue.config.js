module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'stylus',
      patterns: []
    }
  },
  devServer: {
    proxy: {
      '/api': {
        pathRewrite: {
          '^/api': ''
        },
        target: 'http://localhost:9999'
      },
    }
  }
}
