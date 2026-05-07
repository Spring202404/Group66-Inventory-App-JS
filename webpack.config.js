const path = require("path")
module.exports = {
    entry: [
        "./src/js/app.js",
        "./src/js/storage.js",
        "./src/js/categoryView.js",
        "./src/js/productView.js",
        "./src/js/cookieBanner.js",
    ],
    output: {
        path: path.resolve(__dirname, "public/build/webpack"),
        filename: "bundle.js"
    },
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
            }
        },
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },]
    }
}