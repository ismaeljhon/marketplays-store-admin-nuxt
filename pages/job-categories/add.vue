<template>
  <v-row>
    <v-col cols="12">
      <job-category-form></job-category-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddJobCategory',
  layout: 'single-page',
  mounted() {
    this.$store.commit('setPageTitle', 'Add New Job Category')
    this.$store.commit('setBackToPage', {
      link: '/job-categories',
      title: 'Job Categories',
    })
  },
}
</script>
