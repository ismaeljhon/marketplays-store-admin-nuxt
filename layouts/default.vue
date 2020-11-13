<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <div v-for="(item, index) in navigation" :key="index">
          <v-list-item link v-if="item.key != 'divider'" :to="item.link" :disabled="item.disabled">
            <v-list-item-action>
              <v-icon :color="item.icon_color || ''">mdi-{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-else class="my-2"></v-divider>
        </div>
        
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>MarketPlays E-Commerce</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="white"
            v-bind="attrs"
            v-on="on"
            text
          >
            Howdy, John Doe<v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click.prevent="logout">
            <v-list-item-title><v-icon left>mdi-exit-to-app</v-icon>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
              <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">Copyright &copy; {{ new Date().getFullYear() }} All Rights Reserved | Bickert Management Inc.</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      navigation: [
        { key: "dashboard", label: "Dashboard", icon: "view-dashboard", disabled: true },
        { key: "orders", label: "Orders", icon: "cart-outline", link: '/orders'},
        { key: "departments", label: "Departments", icon: "domain", link: '/departments' },
        { key: "services", label: "Products & Services", icon: "cogs", link: '/products' },
        { key: "subscriptions", label: "Subscriptions", icon: "youtube-subscription", disabled: true },
        { key: "job-categories", label: "Job Categories", icon: "shape-outline", link: '/job-categories' },
        { key: "job-listing", label: "Job Listing", icon: "briefcase-outline", link: '/jobs' },
        { key: "divider" },
        { key: "email-template", label: "Email Template", icon: "email-newsletter", link: '/email-templates' },
        { key: "payment-integration", label: "Payment Integration", icon: "credit-card-sync-outline", disabled: true },
        { key: "currency", label: "Currency", icon: "cash-multiple", disabled: true },
        { key: "taxes", label: "Taxes", icon: "bank", disabled: true },
        { key: "coupons", label: "Coupons", icon: "ticket-percent-outline", disabled: true },
        { key: "department-requests", label: "Department Requests", icon: "phone-message-outline", icon_color: "orange darken-1", link: '/department-requests' },
      ]
    }),
    methods: {
      logout() {
      }
    }
  }
</script>