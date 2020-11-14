<template>
  <v-row>
    <v-col cols="12">
      <h1 class="font-weight-regular">Add New Job Category</h1>
    </v-col>
    <v-col cols="12">
      <job-category-form></job-category-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddJobCategory',
  mounted() {
    this.$store.commit('showAsideDrawer', false)
  },
}
</script>
