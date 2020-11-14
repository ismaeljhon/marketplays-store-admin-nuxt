<template>
  <v-row>
    <v-col cols="12">
      <job-form></job-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddJob',
  layout: 'single-page',
  mounted() {
    this.$store.commit('setPageTitle', 'Add New Job')
  },
}
</script>
