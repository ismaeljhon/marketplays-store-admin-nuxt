<template>
  <v-row>
    <v-col cols="12">
      <admin-user-form></admin-user-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'AddAdminUser',
  layout: 'single-page',
  mounted() {
    this.$store.commit('setPageTitle', 'New Admin User')
    this.$store.commit('setBackToPage', {
      link: '/admin-users',
      title: 'Admin Users',
    })
  },
}
</script>
