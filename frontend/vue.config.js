// vue.config.js
module.exports = {
  publicPath: './',
  outputDir: '../frontend-dist',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/style/variables.sass";`
      }
    }
  }
}
