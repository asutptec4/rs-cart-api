// eslint-disable-next-line @typescript-eslint/no-var-requires
const { build } = require('esbuild');

(async () =>
  await build({
    entryPoints: ['dist/main.js'],
    bundle: true,
    platform: 'node',
    target: ['node16'],
    outfile: 'cart-service.js',
    external: [
      '@nestjs/microservices',
      '@nestjs/websockets/socket-module',
      'class-transformer',
      'class-validator',
      'cache-manager',
      'pg-native',
    ],
  }))();
