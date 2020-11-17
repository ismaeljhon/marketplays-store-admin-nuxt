<template>
  <v-row>
    <v-col cols="12">
      <subscription-type-form></subscription-type-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddSubscriptionType',
  layout: 'single-page',
  mounted() {
    this.$store.commit('setPageTitle', 'New Subscription Type')
    this.$store.commit('setBackToPage', {
      link: '/subscription-types',
      title: 'Subscription Types',
    })
  },
}
</script>
