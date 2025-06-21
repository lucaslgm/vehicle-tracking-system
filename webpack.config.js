const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

// Esta é a lista de pacotes que o @nestjs/microservices tenta carregar,
// mas que nós não estamos usando e não queremos instalar.
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
            // Tenta resolver o pacote. Se falhar (lançar um erro),
            // significa que não está instalado e nós o ignoramos.
            require.resolve(resource, { paths: [process.cwd()] });
          } catch (err) {
            // Se o pacote não for encontrado, dizemos ao Webpack para ignorá-lo.
            return true;
          }
          return false;
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.dirname(require.resolve('swagger-ui-dist/package.json')),
            to: '.', // Copia para a raiz do diretório de saída (ex: dist/apps/api)
            globOptions: {
              ignore: ['**/index.html'], // Ignora o ficheiro index.html padrão do Swagger
            },
          },
        ],
      }),
    ],
  };
};
