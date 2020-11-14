<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.queries.department.loading"
        loading-text="Loading Department..."
      />
      <department-form v-else :department="department"></department-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditDepartment',
  layout: 'single-page',
  data: () => ({
    department: {},
  }),
  apollo: {
    department: {
      query: gql`
        query department($id: MongoID!) {
          department(_id: $id) {
            _id
            name
            code
            slug
            description
            pricing
            seoTitle
            seoDescription
            seoKeywords
            teamLead {
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
        if (data.department.teamLead) {
          data.department.teamLead = data.department.teamLead._id
        }
        return data.department
      },
      result(response) {
        this.$store.commit(
          'setPageTitle',
          `Edit Department - ${response.data.department.name}`
        )
      },
    },
  },
}
</script>
