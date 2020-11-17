<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.queries.jobCategory.loading"
        loading-text="Loading Department..."
      />
      <job-category-form v-else :job-category="jobCategory"></job-category-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditJobCategory',
  layout: 'single-page',
  data: () => ({
    jobCategory: {},
  }),
  apollo: {
    jobCategory: {
      query: gql`
        query jobCategory($id: MongoID!) {
          jobCategory(_id: $id) {
            _id
            name
            slug
            seoTitle
            seoKeywords
            seoDescription
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
      update(data) {
        return data.jobCategory
      },
      result(response) {
        this.$store.commit(
          'setPageTitle',
          `Edit Job Category - ${response.data.jobCategory.name}`
        )
      },
    },
  },
  computed: {
    title() {
      return `Edit Job Category - ${this.jobCategory.name || ''}`
    },
  },
  mounted() {
    this.$store.commit('setBackToPage', {
      link: '/job-categories',
      title: 'Job Categories',
    })
  },
}
</script>
