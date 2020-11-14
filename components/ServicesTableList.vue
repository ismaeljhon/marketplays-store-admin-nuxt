<template>
  <div>
    <v-data-table
      v-model="selected"
      :search="search"
      :headers="headers"
      :items.sync="items"
      item-key="_id"
      :options.sync="customOptions"
      :server-items-length="itemListCount"
      @input="$emit('selected', selectedItems)"
      @dblclick:row="emitEdit"
      @update:page="$emit('refresh', customOptions)"
      @update:items-per-page="$emit('refresh', customOptions)"
    >
      <template slot="item.pricing" slot-scope="row">
        {{ row.item.pricing | currency }}
      </template>

      <template slot="item.action" slot-scope="row">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <NuxtLink :to="'/services/' + row.item._id">
              <v-btn color="primary" small icon v-bind="attrs" v-on="on">
                <v-icon>mdi-square-edit-outline</v-icon>
              </v-btn>
            </NuxtLink>
          </template>
          <span>Edit this item</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="error"
              small
              icon
              v-bind="attrs"
              v-on="on"
              @click.prevent="$emit('delete', row.item)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Delete this item</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import _forEach from 'lodash/forEach'
import _assign from 'lodash/assign'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'product-table-list',
  props: {
    items: {
      type: [Object, Array],
      default: null,
    },
    search: {
      type: String,
      default: null,
    },
    options: {
      type: [Object, Array],
      default: null,
    },
    itemListCount: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      headers: [
        { text: 'Name', align: 'start', value: 'name', width: '200px' },
        { text: 'Pricing', align: 'start', value: 'pricing', width: '120px' },
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'action',
          width: '100px',
        },
      ],
      selected: [],
      customOptions: {
        page: 1,
        itemsPerPage: 1,
      },
    }
  },
  computed: {
    selectedItems() {
      _forEach(this.selected, (o) => {
        o.is_selected = true
      })
      return this.selected
    },
  },
  mounted() {
    _assign(this.customOptions, this.options)
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    emitEdit(e, row) {
      this.$emit('edit', row.item)
    },
  },
}
</script>
