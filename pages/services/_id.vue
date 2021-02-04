<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.queries.service.loading"
        loading-text="Loading Service..."
      />
      <service-form v-else :service="service"></service-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditService',
  layout: 'single-page',
  data: () => ({
    service: {},
  }),
  apollo: {
    service: {
      query: gql`
        query service($id: MongoID!) {
          service(_id: $id) {
            _id
            code
            name
            description
            shortDescription
            pricing
            tags
            slug
            workforceThreshold
            seoTitle
            seoKeywords
            seoDescription
            projectManager {
              _id
            }
            department {
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
        if (data.service.projectManager) {
          data.service.projectManager = data.service.projectManager._id
        }

        if (data.service.department) {
          data.service.department = data.service.department._id
        }

        return data.service
      },
      result(response) {
        this.$store.commit(
          'setPageTitle',
          `Edit Service - ${response.data.service.name}`
        )
      },
    },
  },
  mounted() {
    this.$store.commit('setBackToPage', {
      link: '/services',
      title: 'Services',
    })
  },
}
</script>
