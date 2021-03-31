<template>
  <v-row>
    <v-col cols="12">
      <customer-form></customer-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddDepartment',
  layout: 'single-page',
  mounted() {
    this.$store.commit('setPageTitle', 'New Customer')
    this.$store.commit('setBackToPage', {
      link: '/customers',
      title: 'Customers',
    })
  },
}
</script>
