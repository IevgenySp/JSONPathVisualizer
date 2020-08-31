const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {
    let isProd = env && env.NODE_ENV === 'prod';
    let entry = isProd ? {"app.min": './src/index.js'} : {app: './src/index.js'};

    let options = {
        mode: isProd ? 'production' : 'development',
        entry: entry,
        devtool: isProd ? '' : 'inline-source-map',
        devServer: {
            contentBase: './dist',
            historyApiFallback: true
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        // Translates CSS into CommonJS
                        'css-loader',
                        // Compiles Sass to CSS
                        'sass-loader',
                    ],
                },
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                {
                    test: /\.svg/,
                    use: {
                        loader: 'svg-url-loader',
                        options: {}
                    }
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                }]
        },
        optimization: {
            minimize: true,
            minimizer: [new UglifyJsPlugin({
                include: /\.min\.js$/
            })],
        },
        plugins: [
            // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'JSONPathVisualizer',
                template: './index.html'
            }),
            new webpack.DefinePlugin({
                //'process.env': {
                //    NODE_ENV: '"dev"'
                //}
            }),
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja|it/),
        ],
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
    };

    if (isProd) {
        options.optimization = {
            minimize: true,
            minimizer: [new UglifyJsPlugin({
                include: ['app.min.bundle.js', 'vendors.bundle.js']
            })],
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                            name: 'vendors',
                            chunks: 'all'
                    }
                }
            }
        };
    }

    return options;
};
