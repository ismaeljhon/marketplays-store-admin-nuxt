<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" clipped app>
      <v-list dense>
        <div v-for="(item, index) in navigation" :key="index">
          <v-list-item
            v-if="item.key != 'divider'"
            link
            :to="item.link"
            :disabled="item.disabled"
          >
            <v-list-item-action>
              <v-icon :color="item.icon_color || ''"
                >mdi-{{ item.icon }}</v-icon
              >
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-else class="my-2"></v-divider>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark clipped-left>
      <!-- eslint-disable-next-line prettier/prettier -->
      <v-app-bar-nav-icon
        @click.prevent="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title> MarketPlays E-Commerce </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="white" v-bind="attrs" text v-on="on">
            Howdy, John Doe<v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click.prevent="logout">
            <v-list-item-title
              ><v-icon left>mdi-exit-to-app</v-icon>Logout</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <nuxt></nuxt>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer color="indigo" app>
      <span class="white--text"
        >Copyright &copy; {{ new Date().getFullYear() }} All Rights Reserved |
        Bickert Management Inc.</span
      >
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
    navigation: [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: 'view-dashboard',
        link: '/',
      },
      { key: 'orders', label: 'Orders', icon: 'cart-outline', link: '/orders' },
      {
        key: 'customers',
        label: 'Customers',
        icon: 'account-multiple',
        link: '/customers',
      },
      {
        key: 'vendors',
        label: 'Vendors',
        icon: 'account-tie',
        link: '/vendors',
      },
      {
        key: 'categories',
        label: 'Categories',
        icon: 'domain',
        link: '/Categories',
      },
      {
        key: 'services',
        label: 'Products & Services',
        icon: 'cogs',
        link: '/services',
      },
      {
        key: 'subscription-types',
        label: 'Subscriptions Types',
        icon: 'youtube-subscription',
        link: '/subscription-types',
      },
      {
        key: 'job-categories',
        label: 'Job Categories',
        icon: 'shape-outline',
        link: '/job-categories',
      },
      {
        key: 'job-listing',
        label: 'Job Listing',
        icon: 'briefcase-outline',
        link: '/jobs',
      },
      { key: 'divider' },
      {
        key: 'service-requests',
        label: 'Service Requests',
        icon: 'phone-message-outline',
        icon_color: 'orange darken-1',
        link: '/service-requests',
      },
      {
        key: 'admin-users',
        label: 'Admin Users',
        icon: 'shield-account',
        link: '/admin-users',
      },
      {
        key: 'payment-integration',
        label: 'Payment Integration',
        icon: 'credit-card-sync-outline',
        disabled: true,
      },
      {
        key: 'currency',
        label: 'Currency',
        icon: 'cash-multiple',
        disabled: true,
      },
      { key: 'taxes', label: 'Taxes', icon: 'bank', disabled: true },
      {
        key: 'coupons',
        label: 'Coupons',
        icon: 'ticket-percent-outline',
        disabled: true,
      },
    ],
  }),
  watch: {
    '$store.state.asideDrawer'(value) {
      this.drawer = value
    },
  },
  methods: {
    logout() {},
  },
}
</script>
