import Vue from 'vue'
import _forEach from 'lodash/forEach'
import Currencies from '~/assets/currency'

Vue.mixin({
  methods: {
    getCurrencies() {
      const currencies = []
      _forEach(Object.keys(Currencies), (o) => {
        currencies.push(Currencies[o])
      })

      return currencies
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
  },
})
