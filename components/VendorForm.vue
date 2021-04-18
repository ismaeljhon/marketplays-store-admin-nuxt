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
            name="Contact Number"
            :rules="'required'"
          >
            <v-text-field v-model="form.contactNumber" :error-messages="errors">
              <template slot="label">
                Contact Number <span class="red--text">*</span>
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
            name="Business Name"
            :rules="'required'"
          >
            <v-text-field v-model="form.businessName" :error-messages="errors">
              <template slot="label">
                Business Name <span class="red--text">*</span>
              </template>
            </v-text-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Address"
            :rules="'required'"
          >
            <v-text-field
              v-model="form.businessAddress"
              :error-messages="errors"
            >
              <template slot="label">
                Business Address <span class="red--text">*</span>
              </template>
            </v-text-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Time Availability"
            :rules="'required'"
          >
            <p class="mt-10 mb-0">
              Please specify a suitable time for a call back
              <span class="red--text">*</span>
            </p>
            <datepicker
              v-model="form.dateTimeForVerification"
              :errors="errors"
            />
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
import { forEach as _forEach } from 'lodash'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'vendor-form',
  props: {
    vendor: {
      type: Object,
      default: null,
    },
    previousPage: {
      type: String,
      default: '/vendors',
    },
  },
  data: () => ({
    form: {},
  }),
  watch: {
    vendor(value) {
      if (value) this.form = value
    },
  },
  methods: {
    back() {
      this.$router.push(this.previousPage)
      this.resetForm()
    },
    allowedItems(item, field) {
      const updatedItem = {}
      _forEach(Object.keys(item), (key) => {
        if (field.includes(key)) {
          updatedItem[key] = item[key]
        }
      })

      return updatedItem
    },
    resetForm() {
      _assign(this, {
        form: {
          // 'hasExistingMarketplaysPlatform',
          firstName: '',
          lastName: '',
          middleName: '',
          email: '',
          businessName: '',
          businessAddress: '',
          phoneNumber: '',
          contactNumber: '',
          dateTimeForVerification: ''
        },
      })
    },
    async submit() {
      // this.form.pricing = parseFloat(this.form.pricing)
      const allowedItems = this.allowedItems(this.form, [
        'firstName',
        'middleName',
        'lastName',
        'email',
        'contactNumber',
        'phoneNumber',
        'businessName',
        'businessAddress',
        'dateTimeForVerification'
      ])

      let result = null
      if (this.vendor) {
        result = await this.updateMutation(
          'Vendor',
          allowedItems,
          this.vendor._id
        )
      } else {
        result = await this.createMutation('Vendor', allowedItems)
      }

      

      if (result) {
        this.form = {}
        this.back()
        // eslint-disable-next-line no-undef
        swal({
          title: 'Success',
          icon: 'success',
          text: 'Vendor has been successfully saved',
        })
      }
    },
  },
}
</script>
