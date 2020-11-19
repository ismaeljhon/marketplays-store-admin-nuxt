<template>
  <v-card>
    <v-card-title>
      <v-row dense>
        <v-col cols="5">
          <h3 class="mr-2">
            <v-icon left>mdi-phone-message-outline</v-icon> Service Requests
          </h3>
        </v-col>
        <v-col cols="7" class="text-right">
          <download-csv
            class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small"
            :data="serviceRequests"
            style="cursor: pointer"
          >
            <v-icon left>mdi-download</v-icon>Export Service Requests
          </download-csv>
        </v-col>
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
        </v-col>
        <v-col cols="6">
          <v-spacer></v-spacer>
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
        :items="serviceRequests"
        item-key="_id"
        loading-text="Loading please wait..."
        :loading="isLoading"
        :options.sync="tableParams.options"
        :server-items-length="itemsCount"
      >
        <template slot="item.orderNumber" slot-scope="row">
          {{ row.item.subscription.orderline.order.orderNumber }}
        </template>
        <template slot="item.service" slot-scope="row">
          <p>
            {{ row.item.subscription.subscriptionType }}
            <br />
            {{ row.item.service.name }}
          </p>
        </template>
        <template slot="item.customer" slot-scope="row">
          <customer-details
            :customer="row.item.subscription.orderline.order.customer"
          />
        </template>
        <template slot="item.lastActionTaken" slot-scope="row">
          <p>{{ row.item.status }}</p>
        </template>
        <template slot="item.action" slot-scope="row">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                v-bind="attrs"
                color="primary"
                class="mr-2"
                icon
                :href="`mailto:${row.item.subscription.orderline.order.customer.email}`"
                target="_blank"
                v-on="on"
              >
                <v-icon>mdi-email-outline</v-icon>
              </v-btn>
            </template>
            <span>Email Customer</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                v-bind="attrs"
                color="primary"
                class="mr-2"
                icon
                v-on="on"
                @click.prevent="$refs.contactCustomerModal.show(row.item._id)"
              >
                <v-icon>mdi-phone</v-icon>
              </v-btn>
            </template>
            <span>Call Customer</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                v-bind="attrs"
                color="success"
                icon
                :href="`/jobs/add?serviceRequestId=${row.item._id}`"
                target="_blank"
                v-on="on"
              >
                <v-icon>mdi-briefcase-outline</v-icon>
              </v-btn>
            </template>
            <span>Create job listing for this request</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
    <contact-customer-modal ref="contactCustomerModal" />
  </v-card>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'ServiceRequests',
  data: () => ({
    search: null,
    headers: [
      { text: 'Order #', align: 'start', value: 'orderNumber' },
      {
        text: 'Service Subscription',
        align: 'start',
        value: 'service',
        width: '300px',
      },
      { text: 'Customer', align: 'start', value: 'customer' },
      { text: 'Last action taken', align: 'start', value: 'lastActionTaken' },
      {
        text: 'Actions',
        align: 'start',
        sortable: false,
        value: 'action',
        width: '150px',
      },
    ],
    tableParams: {
      model: 'serviceRequests',
      query: gql`
        {
          _id
          subscription {
            subscriptionType
            orderline {
              order {
                orderNumber
                customer {
                  name
                  email
                  address
                }
              }
            }
          }
          service {
            name
          }
          status
        }
      `,
    },
    serviceRequests: [],
  }),
  beforeDestroy() {
    this.clearGetItems()
  },
  mounted() {
    this.getItems()
  },
}
</script>
