<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.loading"
        loading-text="Loading Subscription Type..."
      />
      <subscription-type-form
        v-else
        :subscription-type="subscriptionType"
      ></subscription-type-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditSubscriptionType',
  layout: 'single-page',
  data: () => ({
    subscriptionType: {},
  }),
  apollo: {
    subscriptionType: {
      query: gql`
        query subscriptionType($id: MongoID!) {
          subscriptionType(_id: $id) {
            _id
            name
            description
            shortDescription
            policy
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
      update(data) {
        return data.subscriptionType
      },
      result(response) {
        this.$store.commit(
          'setPageTitle',
          `Edit Subscription Type - ${response.data.subscriptionType.name}`
        )
      },
    },
  },
  mounted() {
    this.$store.commit('setBackToPage', {
      link: '/subscription-types',
      title: 'Subscription Types',
    })
  },
}
</script>
