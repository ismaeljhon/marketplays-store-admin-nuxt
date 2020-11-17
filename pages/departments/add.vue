<template>
  <v-row>
    <v-col cols="12">
      <department-form></department-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddDepartment',
  layout: 'single-page',
  mounted() {
    this.$store.commit('setPageTitle', 'New Department')
    this.$store.commit('setBackToPage', {
      link: '/departments',
      title: 'Departments',
    })
  },
}
</script>
