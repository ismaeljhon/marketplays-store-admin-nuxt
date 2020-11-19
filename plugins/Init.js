/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import _capitalize from 'lodash/capitalize'
import _upperCase from 'lodash/upperCase'
import VueCurrencyFilter from 'vue-currency-filter'
import * as rules from 'vee-validate/dist/rules'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import swal from 'sweetalert'
import VueFileAgent from 'vue-file-agent'
import VueFileAgentStyles from 'vue-file-agent/dist/vue-file-agent.css'
import JsonCSV from 'vue-json-csv'
import { SlickList, SlickItem } from 'vue-slicksort'

Vue.component('vfa-sortable-list', SlickList)
Vue.component('vfa-sortable-item', SlickItem)
Vue.use(VueFileAgent);
Vue.component('downloadCsv', JsonCSV)

Vue.use(require('vue-moment'))

Vue.use(VueCurrencyFilter, {
  symbol: '$',
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: true,
  avoidEmptyDecimals: undefined,
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

Object.keys(rules).forEach((rule) => {
  // eslint-disable-next-line import/namespace
  extend(rule, rules[rule])
})

// with typescript
for (const [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation,
  })
}

/** Filters */
Vue.filter('capitalize', (value) => {
  return _capitalize(value)
})
Vue.filter('uppercase', (value) => {
  return _upperCase(value)
})
Vue.filter('first_of_array', (value) => {
  return value[0]
})
