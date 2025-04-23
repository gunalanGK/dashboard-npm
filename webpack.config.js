// const path = require("path");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// module.exports = {
//   entry: "./src/index.tsx",
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "index.js",
//     library: "MyComponentLib",
//     libraryTarget: "umd",
//     clean: true,
//   },
//   resolve: {
//     extensions: [".ts", ".tsx", ".js", ".jsx"],
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(ts|tsx)$/,
//         use: "ts-loader",
//         exclude: /node_modules/,
//       },
//       {
//         test: /\.scss$/,
//         use: [
//           MiniCssExtractPlugin.loader, // Extracts CSS to a file
//           "css-loader",
//           "sass-loader",
//         ],
//       },
//       { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
//     ],
//   },
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: "styles.css", // ✅ bundle styles into dist/styles.css
//     }),
//     new CopyWebpackPlugin({
//       patterns: [
//         {
//           from: path.resolve(__dirname, "src/assets"),
//           to: path.resolve(__dirname, "dist/public/images"),
//         },
//       ],
//     }),
//   ],
//   externals: {
//     react: "react",
//     "react-dom": "react-dom",
//   },
// };
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx", // Entry point for your package
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js", // Output bundle
    library: "test-npm", // Library name
    libraryTarget: "umd", // Export format for different environments
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias for src folder
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Transpile TypeScript files
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/, // SCSS handling
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        enforce: "pre", // Source map handling
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css", // Bundle SCSS into styles.css
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets"),
          to: path.resolve(__dirname, "dist/public/images"),
        },
      ],
    }),
  ],
  externals: {
    react: "react", // Treat React as external
    "react-dom": "react-dom", // Treat React DOM as external
  },
  devtool: "source-map", // Enable source maps
};
