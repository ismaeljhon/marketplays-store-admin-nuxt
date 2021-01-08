<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.queries.user.loading"
        loading-text="Loading User..."
      />
      <admin-user-form v-else :user="user"></admin-user-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditAdminUser',
  layout: 'single-page',
  data: () => ({
    user: {},
  }),
  apollo: {
    user: {
      query: gql`
        query user($id: MongoID!) {
          user(_id: $id) {
            _id
            fullName
            email
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
        return data.user
      },
      result(response) {
        this.$store.commit(
          'setPageTitle',
          `Edit Admin User - ${response.data.user.fullName}`
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
