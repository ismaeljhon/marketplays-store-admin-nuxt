<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <v-row>
        <v-col cols="12">
          <h4 class="mb-2">General Information</h4>
          <v-divider class="mb-5"></v-divider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Name"
            :rules="'required'"
          >
            <v-text-field v-model="form.firstName" :error-messages="errors">
              <template slot="label">
                First name <span class="red--text">*</span>
              </template>
            </v-text-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="First name"
            :rules="'required'"
          >
            <v-text-field v-model="form.middleName" :error-messages="errors">
              <template slot="label">
                Middle name <span class="red--text">*</span>
              </template>
            </v-text-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Last name"
            :rules="'required'"
          >
            <v-text-field v-model="form.lastName" :error-messages="errors">
              <template slot="label">
                Last Name <span class="red--text">*</span>
              </template>
            </v-text-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Email"
            :rules="'required|email'"
          >
            <v-text-field v-model="form.email" :error-messages="errors">
              <template slot="label">
                Email <span class="red--text">*</span>
              </template>
            </v-text-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Address"
            :rules="'required'"
          >
            <v-text-field v-model="form.address" :error-messages="errors">
              <template slot="label">
                Address <span class="red--text">*</span>
              </template>
            </v-text-field>
          </ValidationProvider>
        </v-col>
      </v-row>

      <div class="mt-2">
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
  name: 'customer-form',
  props: {
    customer: {
      type: Object,
      default: null,
    },
    previousPage: {
      type: String,
      default: '/customers',
    },
  },
  data: () => ({
    form: {
      name: null,
      email: null,
      address: null,
    },
  }),
  watch: {
    customer(value) {
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
          name: null,
          email: null,
          address: null,
        },
      })
    },
    async submit() {
      this.form.pricing = parseFloat(this.form.pricing)
      const allowedItems = this.getAllowedItems(this.form, [
        'firstName',
        'lastName',
        'middleName',
        'email',
        'address',
      ])

      let result = null
      if (this.customer) {
        result = await this.updateMutation(
          'Customer',
          allowedItems,
          this.customer._id
        )
      } else {
        result = await this.createMutation('Customer', allowedItems)
      }

      if (result) {
        this.back()
        // eslint-disable-next-line no-undef
        swal({
          title: 'Success',
          icon: 'success',
          text: 'Customer has been successfully saved',
        })
      }
    },
  },
}
</script>
