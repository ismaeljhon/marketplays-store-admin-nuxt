<template>
  <v-row>
    <v-col cols="12">
      <h2 class="font-weight-regular">{{ title }}</h2>
    </v-col>
    <v-col cols="12">
      <job-category-form :job-category="jobCategory"></job-category-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditJobCategory',
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
    },
  },
  computed: {
    title() {
      return `Edit Job Category - ${this.jobCategory.name || ''}`
    },
  },
  mounted() {
    this.$store.commit('showAsideDrawer', false)
  },
}
</script>
