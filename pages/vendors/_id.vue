<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.queries.vendor.loading"
        loading-text="Loading Vendors..."
      />
      <vendor-form v-else :vendor="vendor"></vendor-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditVendor',
  layout: 'single-page',
  data: () => ({
    vendor: {},
  }),
  props: {
    dateTimeForVerification: {
      type: Date,
    },
  },
  apollo: {
    vendor: {
      query: gql`
        query vendor($id: MongoID!) {
          vendor(_id: $id) {
            _id
            firstName
            lastName
            middleName
            email
            businessName
            businessAddress
            phoneNumber
            contactNumber
            dateTimeForVerification
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
      update(data) {
        return data.vendor
      },
      result(response) {
        this.$store.commit(
          'setPageTitle',
          `Edit Vendor - ${response.data.vendor.firstName} ${response.data.vendor.lastName}`
        )
      },
    },
  },
  mounted() {
    this.$store.commit('setBackToPage', {
      link: '/vendors',
      title: 'Vendors',
    })
  },
}
</script>
