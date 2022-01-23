const isProd = process.env.NODE_ENV === 'production' // 'development'

module.exports = {
  publicPath: './',
  outputDir: './dist',
  productionSourceMap: false,
  css: {
    // extract: false,
    sourceMap: false,
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/variables.scss";`
      }
    }
  },
  configureWebpack: {
    externals: isProd ? [] : [
      {
        '@canwdev/tank-ui': 'tankUI',
      }
    ]
  },
  pwa: {
    maskIcon: null
  }
}
