<template>
  <v-row>
    <v-col cols="12">
      <vendor-form></vendor-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddVendor',
  layout: 'single-page',
  mounted() {
    this.$store.commit('setPageTitle', 'New Vendor')
    this.$store.commit('setBackToPage', {
      link: '/vendors',
      title: 'Vendors',
    })
  },
}
</script>
