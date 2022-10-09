export function getDevServerConfig() {
  return {
    contentBase: "./build/public",
    compress: true,
    historyApiFallback: true,
    hot: true,
  };
}
