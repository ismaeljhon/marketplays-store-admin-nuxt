<template>
  <v-app id="inspire">
    <v-app-bar app color="primary" dark clipped-left>
      <!-- eslint-disable-next-line prettier/prettier -->
      <v-row>
        <v-col cols="4">
          <NuxtLink :to="$store.state.backToPage.link || '/'">
            <v-btn text>
              <v-icon left>mdi-arrow-left</v-icon> Back to
              {{ $store.state.backToPage.title || 'Dashboard' }}
            </v-btn>
          </NuxtLink>
        </v-col>
        <v-col cols="4">
          <v-toolbar-title class="text-center">
            {{ $store.state.pageTitle }}
          </v-toolbar-title>
        </v-col>
        <v-col cols="4"></v-col>
      </v-row>
    </v-app-bar>
    <v-main style="background: #fafafa">
      <v-container fluid>
        <v-row>
          <v-col class="py-0">
            <nuxt></nuxt>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {}
</script>
