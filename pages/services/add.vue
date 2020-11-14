<template>
  <v-row>
    <v-col cols="12">
      <service-form></service-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddService',
  layout: 'single-page',
  mounted() {
    this.$store.commit('setPageTitle', 'New Service')
  },
}
</script>
