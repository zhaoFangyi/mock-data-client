module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'stylus',
      patterns: [],
    },
  },
  configureWebpack: {},
  chainWebpack: function (config) {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('html-loader')
      .loader('html-loader')
      .end()
      .use('markdown-loader')
      .loader('markdown-loader')
      .end()
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: false,
    },
    proxy: {
      '/api': {
        pathRewrite: {
          '^/api': '',
        },
        // target: 'http://47.96.110.34:38080/'
        target: 'http://192.168.75.214:9999',
        // target: 'http://localhost:9999'
      },
    },
  },
}
