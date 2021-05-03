<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.queries.category.loading"
        loading-text="Loading Categories..."
      />
      <category-form v-else :category="category"></category-form>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditCategory',
  layout: 'single-page',
  data: () => ({
    category: {},
  }),
  apollo: {
    category: {
      query: gql`
        query category($id: MongoID!) {
          category(_id: $id) {
            _id
            name
            code
            slug
            description
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
        if (data.category.teamLead) {
          data.category.teamLead = data.category.teamLead._id
        }
        return data.category
      },
      result(response) {
        this.$store.commit(
          'setPageTitle',
          `Edit Category - ${response.data.category.name}`
        )
      },
    },
  },
  mounted() {
    this.$store.commit('setBackToPage', {
      link: '/categories',
      title: 'Categories',
    })
  },
}
</script>
