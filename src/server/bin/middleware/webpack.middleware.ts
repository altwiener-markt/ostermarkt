import * as path from 'path';
import * as express from 'express';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';

const webpackConfPath = path.join(__dirname, '../../../', 'config', 'webpack.dev.js');
const webpackConfig = require(path.resolve(webpackConfPath));

// const webpackConfig = require('../../../../config/webpack.dev.js');
const compiler = webpack(webpackConfig);

export function useWebpackMiddleware(app: express.Application) {
  // Attach the dev middleware to the compiler & the server
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));

  // Attach the hot middleware to the compiler & the server
  app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));
}
