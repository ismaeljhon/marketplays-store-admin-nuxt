<template>
  <v-row>
    <v-col cols="12">
      <category-form></category-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddCategory',
  layout: 'single-page',
  mounted() {
    this.$store.commit('setPageTitle', 'New Category')
    this.$store.commit('setBackToPage', {
      link: '/categories',
      title: 'Categories',
    })
  },
}
</script>
