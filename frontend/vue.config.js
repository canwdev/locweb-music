// vue.config.js
module.exports = {
  outputDir: '../frontend-dist',
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/style/variables.sass";`
      }
    }
  }
}
