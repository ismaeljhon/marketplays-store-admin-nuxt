import Vue from 'vue'
import _forEach from 'lodash/forEach'
import gql from 'graphql-tag'
import Currencies from '~/assets/currency'

Vue.mixin({
  methods: {
    getCurrencies() {
      return Object.keys(Currencies).map((code) => {
        return Currencies[code]
      })
    },
    getAllowedItems(item, fields) {
      const updatedItem = {}
      _forEach(Object.keys(item), (key) => {
        if (fields.includes(key)) {
          updatedItem[key] = item[key]
        }
      })

      return updatedItem
    },
    async generateVariantsData(data) {
      debugger;
      const record = {
        attributeData: data.map((attribute) => {
          return {
            attribute: { name : attribute.name , code : attribute.name },
            options: attribute.options.map((option) => {
              return { name : option.name, code: option.name }
            }),
          }
        }),
      }

      return await this.$apollo
        .mutate({
          mutation: gql`
            mutation generateVariants($record: GenerateVariantsInput!) {
              generateVariants(record: $record) {
                record {
                  variants {
                    name
                    code 
                    attributeData {
                      attribute {
                        name
                        code
                      }
                      option {
                        name
                        code
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {
            record,
          },
        })
        .then((response) => {
          return response.data.generateVariants.record.variants
        })
        .catch(() => {
          // eslint-disable-next-line no-undef
          swal({
            title: 'Error',
            icon: 'error',
            text: `Something went wrong while generating variants`,
          })
          return []
        })
    },
  },
})
