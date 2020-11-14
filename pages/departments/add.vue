<template>
  <v-row>
    <v-col cols="12">
      <h1 class="font-weight-regular">Add New Department</h1>
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
