<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.queries.customer.loading"
        loading-text="Loading Customer..."
      />
      <customer-form v-else :customer="customer"></customer-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditCustomer',
  layout: 'single-page',
  data: () => ({
    customer: {},
  }),
  apollo: {
    customer: {
      query: gql`
        query customer($id: MongoID!) {
          customer(_id: $id) {
            _id
            name
            email
            address
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
      update(data) {
        return data.customer
      },
      result(response) {
        this.$store.commit(
          'setPageTitle',
          `Edit Customer - ${response.data.customer.name}`
        )
      },
    },
  },
  mounted() {
    this.$store.commit('setBackToPage', {
      link: '/customers',
      title: 'Customers',
    })
  },
}
</script>
