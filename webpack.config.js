var webpack = require('webpack');

module.exports = {
    entry: {
        app: __dirname + "/public/javascripts/main.js",
    },
    output: {
        path: __dirname + "/public/javascripts/",
        filename: "main.bundle.js"
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      })
    ]
};
