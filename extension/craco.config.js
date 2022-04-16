module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        entry: {
          main: [
            env === "development" &&
              require.resolve("react-dev-utils/webpackHotDevClient"),
            paths.appIndexJs,
          ].filter(Boolean),
          background: ["./src/background/chromeListeners.ts"],
        },
        output: {
          ...webpackConfig.output,
          filename: "[name].js",
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
      };
    },
  },
};
