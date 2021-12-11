module.exports = {
  apps: [
    {
      name: 'eth-system',
      script: './dist/server.js',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      instances: 1,
      env_prod: {
        'NODE_ENV': 'prod',
      },
      error_file: 'dist/logs/pm2.err.log',
      out_file: 'dist/logs/pm2.out.log',
      time: true,
      kill_timeout : 3000,
    },
    {
      name: 'subscribe-infura',
      script: './dist/bin/subscribe.js',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      instances: 1,
      env_prod: {
        'NODE_ENV': 'prod',
      },
      error_file: 'dist/logs/pm2-subscribe.err.log',
      out_file: 'dist/logs/pm2-subscribe.out.log',
      time: true,
      kill_timeout : 3000,
    },
  ],
};
