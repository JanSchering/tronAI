var webpack = require("webpack");
const path = require("path");
const isDevelopment = process.env.NODE_ENV === "development";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const remarkContainers = require("remark-containers");

var config = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"],
      },
      {
        test: /\.mdx?$/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "@mdx-js/loader",
            options: {
              remarkPlugins: [remarkContainers],
            },
          },
        ],
      },
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: isDevelopment,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "file-loader", // Or `url-loader` or your other loader
          },
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              severityError: "warning", // Ignore errors on corrupted images
              minimizerOptions: {
                plugins: [
                  ["gifsicle", { interlaced: true }],
                  ["jpegtran", { progressive: true }],
                  ["optipng", { optimizationLevel: 5 }],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".mdx", ".scss", ".tsx", ".ts"],
  },
  devtool: "inline-source-map",
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDevelopment ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
    }),
    new webpack.SourceMapDevToolPlugin({}),
  ],
};

var tronAIConfig = Object.assign({}, config, {
  entry: {
    index: path.resolve(__dirname, "app.tsx"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
});

module.exports = [tronAIConfig];
