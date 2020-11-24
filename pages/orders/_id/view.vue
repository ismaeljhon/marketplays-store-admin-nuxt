<template>
  <v-row>
    <v-col cols="12">
      <loading
        v-if="$apollo.queries.order.loading"
        loading-text="Loading Order..."
      />
      <div v-else>
        <v-row>
          <v-col cols="6">
            <v-card class="mt-3">
              <v-card-title>Order Details</v-card-title>
              <v-divider />
              <v-card-text>
                <p class="mt-3">
                  <strong>Order #: </strong>{{ order.orderNumber }}
                  <br />
                  <strong>Date Created: </strong>
                  <date-format :date="order.created"></date-format>
                  <br />
                  <strong>Date Modified: </strong>
                  <date-format :date="order.changed"></date-format>
                </p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="mt-3">
              <v-card-title>Customer Details</v-card-title>
              <v-divider />
              <v-card-text>
                <customer-details
                  :customer="order.customer"
                  show-full-address
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card class="">
              <v-card-title>Orderlines</v-card-title>
              <v-divider />
              <v-card-text>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Orderline #</th>
                        <th class="text-left">Subscription</th>
                        <th class="text-left">Unit Price</th>
                        <th class="text-left">Quantity</th>
                        <th class="text-left">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="orderlineItem in order.orderlines"
                        :key="orderlineItem._id"
                      >
                        <td>{{ orderlineItem.orderlineNumber }}</td>
                        <td>
                          <p class="mt-5">
                            {{
                              orderlineItem.subscription.subscriptionType.name
                            }}
                          </p>
                          <p
                            v-for="serviceItem in orderlineItem.subscription
                              .services"
                            :key="serviceItem._id"
                            class="my-0"
                          >
                            - {{ serviceItem.name }}
                          </p>
                          <br />
                        </td>
                        <td>{{ orderlineItem.unitPrice | currency }}</td>
                        <td>{{ orderlineItem.quantity }}</td>
                        <td>{{ orderlineItem.totalPrice | currency }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer></v-spacer>
                <h3 class="float-right my-5 mr-5">
                  Total: {{ order.totalAmount | currency }}
                </h3>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'ViewOrder',
  layout: 'single-page',
  data: () => ({
    order: {},
  }),
  apollo: {
    order: {
      query: gql`
        query order($id: MongoID!) {
          order(_id: $id) {
            _id
            orderNumber
            totalAmount
            created
            changed
            customer {
              name
              address
              email
            }
            orderlines {
              _id
              orderlineNumber
              subscription {
                _id
                subscriptionType {
                  name
                }
                services {
                  _id
                  name
                  pricing
                }
                totalPrice
                serviceRequests {
                  _id
                  jobs {
                    title
                  }
                }
              }
              unitPrice
              quantity
              totalPrice
              sort
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
        return data.order
      },
      result(response) {
        this.$store.commit(
          'setPageTitle',
          `View Order: ${response.data.order.orderNumber}`
        )
      },
    },
  },
  mounted() {
    this.$store.commit('setBackToPage', {
      link: '/orders',
      title: 'Orders',
    })
  },
}
</script>
