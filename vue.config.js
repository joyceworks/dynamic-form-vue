module.exports = {
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
      },
      postcss: {
        plugins: [],
      },
    },
  },
  publicPath: process.env.NODE_ENV === "production" ? "/dynamic-form-vue" : "/"
};