import colors from 'vuetify/es5/util/colors'
import Config from './config'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - marketPlays Store Admin',
    title: 'marketPlays Store Admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  publicRuntimeConfig: {
    apiUrl: Config.apiUrl,
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/style.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // '~/plugins/GlobalMixins',
    '~/plugins/TableMixin',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/apollo',
    'sweetalert',
  ],

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: Config.apiUrl,
      },
    },
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  ssr: false,
  loadingIndicator: {
    name: 'three-bounce',
    color: '#BE1E2D',
    background: 'white',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
