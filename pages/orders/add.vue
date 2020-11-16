<template>
  <v-row>
    <v-col cols="12">
      <order-form></order-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddOrder',
  layout: 'single-page',
  mounted() {
    this.$store.commit('setPageTitle', 'New Order')
  },
}
</script>
