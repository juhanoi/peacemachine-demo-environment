var webpack = require('webpack');

var sourceDir = __dirname + "/public/javascripts";

module.exports = {
    entry: [
        sourceDir + "/main.js",
        sourceDir + "/analyze.js",
        sourceDir + "/visualization.js",
        sourceDir + "/liveanalyzer.js"
    ],
    output: {
        path: __dirname + "/public/javascripts/",
        filename: "main.bundle.js"
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        d3: "d3"
      })
    ]
};
