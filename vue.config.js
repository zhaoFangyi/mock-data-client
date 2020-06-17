module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'stylus',
      patterns: []
    }
  },
  configureWebpack: {},
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      '/api': {
        pathRewrite: {
          '^/api': ''
        },
        target: 'http://47.96.110.34:38080/'
      },
    }
  }
}
