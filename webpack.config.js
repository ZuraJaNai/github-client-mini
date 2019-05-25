var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    index: __dirname + "/src/js/index.js",
    search: __dirname + "/src/js/search.js",
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: [/.css$/],
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/search.html",
      filename: "search.html",
      chunks: ["search"],
    }),
  ],
};
