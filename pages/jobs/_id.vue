<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.queries.job.loading"
        loading-text="Loading Job..."
      />
      <job-form v-else :job="job"></job-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditJob',
  layout: 'single-page',
  data: () => ({
    job: {},
  }),
  apollo: {
    job: {
      query: gql`
        query job($id: MongoID!) {
          job(_id: $id) {
            _id
            title
            slug
            description
            instructions
            biddable
            openingMarketBid
            type
            timeframe
            seoTitle
            seoKeywords
            seoDescription
            currency
            requiredCertificates
            category
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
      update(data) {
        return data.job
      },
      result(response) {
        this.$store.commit(
          'setPageTitle',
          `Edit Job - ${response.data.job.title}`
        )
      },
    },
  },
  mounted() {
    this.$store.commit('setBackToPage', {
      link: '/jobs',
      title: 'Jobs',
    })
  },
}
</script>
