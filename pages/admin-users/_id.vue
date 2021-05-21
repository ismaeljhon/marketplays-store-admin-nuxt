<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.queries.admin.loading"
        loading-text="Loading Admin User..."
      />
      <admin-user-form v-else :admin="admin"></admin-user-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditAdminUser',
  layout: 'single-page',
  data: () => ({
    admin: {},
  }),
  apollo: {
    admin: {
      query: gql`
        query admin($id: MongoID!) {
          admin(_id: $id) {
            _id
            firstName
            middleName
            lastName
            email
            contactNumber
            teamLeadOf {
              _id
            }
            projectManagerOf {
              _id
            }
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
      update(data) {
        return data.admin
      },
      result(response) {

        this.$store.commit(
          'setPageTitle',
          `Edit Admin User - ${response.data.admin.firstName} ${response.data.admin.lastName}`
        )
      },
    },
  },
  mounted() {
    this.$store.commit('setBackToPage', {
      link: '/admin-users',
      title: 'Admin Users',
    })
  },
}
</script>
