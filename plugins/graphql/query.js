import swal from 'sweetalert'
import Vue from 'vue'
import gql from 'graphql-tag'

Vue.mixin({
  data: () => ({
    isLoading: false,
  }),
  methods: {
    getList(model = null, fieldsNeeded = [], filters = null) {
      if (!model)
        return swal({
          icon: 'error',
          title: 'Error',
          text: 'Please specify which model to use',
        })
      const filterQuery = filters
        ? `(${Object.keys(filters)
            .map((key) => `${key}: ${filters[key]}`)
            .join(', ')})`
        : ``

      this.$apollo.addSmartQuery(model, {
        query: gql`query {
            ${model} ${filterQuery} {
              ${fieldsNeeded.join('\n')}
            }
          }
        `,
        result({ loading }) {
          this.isLoading = loading
        },
        update(data) {
          return data[model]
        },
      })

      this.$apollo.queries[model].start()
    },
  },
})
