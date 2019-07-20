const webpack = require('webpack');
const path = require('path');

let PLUGINS = [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
];

if (process.env.NODE_ENV === 'production') {
    PLUGINS.push(new webpack.optimize.UglifyJsPlugin());
}
PLUGINS.push( new webpack.LoaderOptionsPlugin({ debug: true }) );

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    output: {
        path: path.join(__dirname, 'built'),
        filename: 'main.js'
    },
    plugins: PLUGINS,
    devServer: {
        disableHostCheck: true,
        hot: true,
        contentBase: '.',
        inline: true,
        host: '0.0.0.0'
    },
    module: {
        rules: [
            // {
            //     enforce: 'pre',
            //     test: /\.tsx?$/,
            //     loader: 'tslint-loader',
            //     exclude: /node_modules/,
            //     options: {
            //         failOnHint: true,
            //         configuration: require('./tslint.json')
            //     }
            // },
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            {
              test: /\.tsx?$/,
              loader: "ts-loader"
            }
        ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
};