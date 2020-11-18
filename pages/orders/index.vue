<template>
  <v-card>
    <v-card-title>
      <v-row dense>
        <v-col cols="5">
          <h3 class="mr-2"><v-icon left>mdi-domain</v-icon> Orders</h3>
        </v-col>
        <v-col cols="7" class="text-right">
          <download-csv
            class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small"
            :data="orders"
            style="cursor: pointer"
          >
            <v-icon left>mdi-download</v-icon>Export Orders
          </download-csv>
          <NuxtLink to="/orders/add">
            <v-btn small color="primary">
              <v-icon left>mdi-plus</v-icon>Add Order
            </v-btn>
          </NuxtLink>
        </v-col>
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
        </v-col>
        <v-col cols="6">
          <v-btn
            v-if="hasSelectedItems"
            outlined
            small
            tile
            color="error"
            @click.prevent="deleteItems(tableItems.selected)"
          >
            <v-icon left>mdi-close</v-icon> Delete Selected
          </v-btn>
          <v-spacer v-else></v-spacer>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="search"
            dense
            filled
            single-line
            hide-details
            append-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        v-model="tableItems.selected"
        :search="search"
        :headers="headers"
        :items="orders"
        item-key="_id"
        loading-text="Loading please wait..."
        :loading="isLoading"
        :options.sync="tableParams.options"
        :server-items-length="itemsCount"
        @input="afterSelectedEventsOnTableList"
      >
        <template slot="item.customer" slot-scope="row">
          <customer-details :customer="row.item.customer" />
        </template>
        <template slot="item.totalAmount" slot-scope="row">
          {{ row.item.totalAmount | currency }}
        </template>
        <template slot="item.created" slot-scope="row">
          <date-format :date="row.item.created" />
        </template>
        <template slot="item.changed" slot-scope="row">
          <date-format :date="row.item.changed" />
        </template>
        <template slot="item.action" slot-scope="row">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <NuxtLink :to="'/orders/' + row.item._id + '/view'">
                <v-btn small v-bind="attrs" color="primary" icon v-on="on">
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </NuxtLink>
            </template>
            <span>View Order</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'Orders',
  data: () => ({
    search: null,
    headers: [
      { text: 'Order #', align: 'start', value: 'orderNumber' },
      { text: 'Customer', align: 'start', value: 'customer' },
      { text: 'Total', align: 'start', value: 'totalAmount' },
      { text: 'Created', align: 'start', value: 'created' },
      { text: 'Modified', align: 'start', value: 'changed' },
      { text: 'Actions', align: 'start', sortable: false, value: 'action' },
    ],
    tableParams: {
      model: 'orders',
      query: gql`
        {
          _id
          orderNumber
          customer {
            name
            email
            address
          }
          totalAmount
          created
          changed
        }
      `,
    },
    orders: [],
  }),
  beforeDestroy() {
    this.clearGetItems()
  },
  mounted() {
    this.getItems()
  },
  methods: {
    afterSelectedEventsOnTableList(items) {
      this.tableItems.selected = items
    },
  },
}
</script>
