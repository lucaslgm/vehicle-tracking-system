const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const lazyImports = [
  '@nestjs/websockets/socket-module',
  '@nestjs/platform-socket.io',
  'kafkajs',
  'mqtt',
  'nats',
  '@grpc/grpc-js',
  '@grpc/proto-loader',
  'ioredis',
  'class-transformer/storage',
];

module.exports = function (options) {
  return {
    ...options,
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource, { paths: [process.cwd()] });
          } catch (err) {
            return true;
          }
          return false;
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.dirname(require.resolve('swagger-ui-dist/package.json')),
            to: '.',
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
    ],
  };
};
