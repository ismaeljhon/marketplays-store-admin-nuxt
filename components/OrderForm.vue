<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <v-row>
        <v-col cols="12">
          <h4 class="mb-2">General Information</h4>
          <v-divider class="mb-5"></v-divider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Customer"
            :rules="'required'"
          >
            <v-autocomplete
              v-model="form.customer"
              :items="customers"
              hide-no-data
              item-text="name"
              item-value="_id"
              :error-messages="errors"
            >
              <template slot="label">
                Customer <span class="red--text">*</span>
              </template>
            </v-autocomplete>
          </ValidationProvider>

          <v-card v-if="customerSelected">
            <v-card-title>Customer Details</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <customer-details
                :customer="customerSelected"
                show-full-address
              />
            </v-card-text>
          </v-card>

          <v-card
            v-for="(subscription, subscriptionIndex) in form.subscriptions"
            :key="subscriptionIndex"
            class="mt-3"
          >
            <v-card-title>
              Subscription #{{ subscriptionIndex + 1 }}
              <v-spacer></v-spacer>
              <v-btn
                v-if="subscriptionIndex > 0"
                class="ml-2"
                color="error"
                icon
                @click.prevent="removeSubscription(subscriptionIndex)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <ValidationProvider
                v-slot="{ errors }"
                name="Subscription Type"
                :rules="'required'"
              >
                <v-autocomplete
                  v-model="form.subscriptions[subscriptionIndex].type"
                  :items="subscriptionTypes"
                  hide-no-data
                  item-text="name"
                  item-value="_id"
                  :error-messages="errors"
                >
                  <template slot="label">
                    Subscription <span class="red--text">*</span>
                  </template>
                </v-autocomplete>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Services"
                :rules="'required'"
              >
                <v-autocomplete
                  v-model="form.subscriptions[subscriptionIndex].services"
                  :items="services"
                  hide-no-data
                  item-text="name"
                  item-value="_id"
                  chips
                  multiple
                  deletable-chips
                  :error-messages="errors"
                >
                  <template slot="label">
                    Services <span class="red--text">*</span>
                  </template>
                </v-autocomplete>
              </ValidationProvider>
            </v-card-text>
          </v-card>
          <v-btn
            class="mt-5"
            small
            color="primary"
            outlined
            @click.prevent="addMoreSubscription"
          >
            <v-icon left>mdi-plus</v-icon>Add more Subscriptions
          </v-btn>
        </v-col>
      </v-row>

      <div class="mt-10">
        <v-btn @click.prevent="back">cancel</v-btn>
        <v-btn color="primary" type="submit" class="float-right">save</v-btn>
      </div>
    </form>
  </ValidationObserver>
</template>
<script>
import gql from 'graphql-tag'
import _assign from 'lodash/assign'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'order-form',
  apollo: {
    customers: {
      query: gql`
        query {
          customers {
            _id
            name
            email
            address
          }
        }
      `,
      update(data) {
        return data.customers
      },
    },
    subscriptionTypes: {
      query: gql`
        query {
          subscriptionTypes {
            _id
            name
          }
        }
      `,
      update(data) {
        return data.subscriptionTypes
      },
    },
    services: {
      query: gql`
        query {
          services {
            _id
            name
          }
        }
      `,
      update(data) {
        return data.services
      },
    },
  },
  props: {
    order: {
      type: Object,
      default: null,
    },
    previousPage: {
      type: String,
      default: '/orders',
    },
  },
  data: () => ({
    form: {
      customer: null,
      subscriptions: [{ type: null, services: [] }],
    },
    customers: [],
    subscriptionTypes: [],
  }),
  computed: {
    customerSelected() {
      return (
        this.customers.find(
          (customer) => customer._id === this.form.customer
        ) || null
      )
    },
  },
  watch: {
    order(value) {
      if (value) this.form = value
    },
  },
  methods: {
    back() {
      this.$router.push(this.previousPage)
      this.resetForm()
    },
    resetForm() {
      _assign(this, {
        form: {
          customer: null,
          subscriptions: [{ type: null, services: [] }],
        },
      })
    },
    addMoreSubscription() {
      this.form.subscriptions.push({
        type: null,
        services: [],
      })
    },
    addMoreSubscriptionService(index) {
      this.form.subscriptions[index].services.push({
        type: null,
        services: [],
      })
    },
    removeSubscription(index) {
      this.form.subscriptions.splice(index, 1)
    },
    async submit() {
      const allowedItems = this.getAllowedItems(this.form, [
        'customer',
        'subscriptions',
      ])

      let result = null
      if (this.department) {
        result = await this.updateMutation(
          'Order',
          allowedItems,
          this.department._id
        )
      } else {
        result = await this.createMutation('Order', allowedItems)
      }

      if (result) {
        this.back()
        // eslint-disable-next-line no-undef
        swal({
          title: 'Success',
          icon: 'success',
          text: 'Order has been successfully saved',
        })
      }
    },
  },
}
</script>
