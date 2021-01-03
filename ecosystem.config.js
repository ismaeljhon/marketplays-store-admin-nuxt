module.exports = {
  apps: [
    {
      name: 'marketPlays',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      env_production: {
        NODE_ENV: 'production',
        BASE_URL: '',
        API_BASE_URL: '',
      },
      env_staging: {
        NODE_ENV: 'staging',
        BASE_URL: 'https://staging.marketplays.app/store-admin',
        API_BASE_URL: 'http://localhost:5001',
      },
      env: {
        NODE_ENV: 'development',
        BASE_URL: 'https://localhost:3000',
        API_BASE_URL: 'http://localhost:5001',
      },
    },
  ],
  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy':
        'yarn install && yarn build && pm2 startOrRestart ecosystem.config.js --env production',
      'pre-setup': '',
      env: {
        NODE_ENV: 'production',
      },
    },
    staging: {
      user: 'root',
      host: 'staging.marketplays.app',
      ref: 'origin/staging',
      repo: 'https://github.com/ismaeljhon/marketplays-store-admin-nuxt',
      path: '/home/marketplays/public_html/staging/main/store_admin',
      'pre-deploy-local': '',
      'post-deploy':
        'git pull origin staging && yarn install && yarn build && pm2 startOrRestart ecosystem.config.js --env staging',
      'pre-setup': '',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
}
