const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const postCssConfig = require( './postcss.config' );
const babelConfig = require( './babelrc.config' );

let config = {
    resolve: {
        descriptionFiles: [ './../package.json' ]
    },
    entry: {
        index: './../entries/index.js',
    },
    output: {
        filename: './../build/[name].js',
        path: __dirname
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
					loader: "babel-loader",
					options: babelConfig,
				}
            },
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: /node_modules/,
                use: [
                    // fallback to style-loader in development
                    this.mode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                    {
                        loader: 'postcss-loader',
                        options: postCssConfig,
                    }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./../build/[name].css",
            chunkFilename: "[id].css"
        }),
    ]
};

module.exports = (env, argv) => {

    if ( argv.mode === 'development' ) {
        config.devtool = 'source-map';
    }

    config.mode = argv.mode;
    return config;
};
