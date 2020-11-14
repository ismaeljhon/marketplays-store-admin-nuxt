<template>
  <v-row>
    <v-col cols="12">
      <h2 class="text-center">Add New Department</h2>
    </v-col>
    <v-col cols="12">
      <department-form></department-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddDepartment',
  mounted() {
    this.$store.commit('showAsideDrawer', false)
  },
}
</script>
