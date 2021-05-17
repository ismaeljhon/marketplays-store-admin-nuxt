<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <v-row>
        <v-col cols="12">
          <h4 class="mb-2">General Information</h4>
          <v-divider class="mb-5"></v-divider>
          <ValidationProvider
            v-slot="{ errors }"
            name="First Name"
            :rules="'required'"
          >
            <v-text-field v-model="form.firstName" :error-messages="errors">
              <template slot="label">
                First Name <span class="red--text">*</span>
              </template>
            </v-text-field>
          </ValidationProvider>

    <ValidationProvider
            v-slot="{ errors }"
            name="Middle Name"
            :rules="'required'"
          >
            <v-text-field v-model="form.middleName" :error-messages="errors">
              <template slot="label">
                Middle Name <span class="red--text">*</span>
              </template>
            </v-text-field>
          </ValidationProvider>

    <ValidationProvider
            v-slot="{ errors }"
            name="Last Name"
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
                Contact Number<span class="red--text">*</span>
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
          <v-text-field v-if="isEdit" v-model="form.password" type="password">
            <template slot="label">
              Password
              <small>
                (Leave this blank if you don't want to update password)
              </small>
            </template>
          </v-text-field>
          <div v-else>
            <ValidationProvider
              v-slot="{ errors }"
              name="Password"
              vid="password"
              rules="required"
            >
              <v-text-field
                v-model="form.password"
                :error-messages="errors"
                type="password"
              >
                <template slot="label">
                  Password <span class="red--text">*</span>
                </template>
              </v-text-field>
            </ValidationProvider>

            <ValidationProvider
              v-slot="{ errors }"
              name="Password confirmation"
              vid="confirm"
              rules="required|password:@password"
            >
              <v-text-field
                v-model="form.confirmPassword"
                :error-messages="errors"
                type="password"
              >
                <template slot="label">
                  Confirm Password <span class="red--text">*</span>
                </template>
              </v-text-field>
            </ValidationProvider>
          </div>
          <v-autocomplete
            v-model="form.teamLeadOf"
            :items="categories"
            hide-no-data
            item-text="name"
            item-value="_id"
            multiple
            chips
            deletable-chips
            label="Team Lead of category(s):"
          ></v-autocomplete>
          <v-autocomplete
            v-model="form.projectManagerOf"
            :items="services"
            hide-no-data
            item-text="name"
            item-value="_id"
            multiple
            chips
            deletable-chips
            label="Product Manager of service(s):"
          ></v-autocomplete>
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
import { assign as _assign, merge as _merge } from 'lodash'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'admin-user-form',
  props: {
    admin: {
      type: Object,
      default: null,
    },
    previousPage: {
      type: String,
      default: '/admin-users',
    },
  },
  data: () => ({
    form: {
      firstName : null,
      middleName : null,
      lastName : null,
      email: null,
      contactNumber: null,
      password: null,
      password: null,
      teamLeadOf: [],
      projectManagerOf: [],
    },
    categories: [],
    services: [],
  }),
  computed: {
    isEdit() {
      return Boolean(this.admin && this.admin._id)
    },   
  },
  watch: {
    admin(value) {      
      console.log(value)
      if (value) this.form = value        
    },
  },
  mounted() {
    this.getList('categories', ['_id', 'name'])
    this.getList('services', ['_id', 'name'])
  },
  methods: {
    back() {
      this.$router.push(this.previousPage)
      this.resetForm()
    },
    resetForm() {
      _assign(this, {
        form: {
          firstName : null,
          middleName : null,
          lastName : null,
          email: null,
          contactNumber: null,
          password: null,
          teamLeadOf: [],
          projectManagerOf: [],
        },
      })
    },
    async submit() {
      
      const allowedItems = this.getAllowedItems(this.form, [
        'firstName',
        'middleName',
        'lastName',
        'contactNumber',
        'email',
        'password',
        'teamLeadOf',
        'projectManagerOf'
      ])

      // check if teamLeadOf and projectManagerOf is array of id;
      // update it if not
      
      allowedItems.projectManagerOf = allowedItems.projectManagerOf.map(x=>{
        return typeof(x) === 'object'? x._id : x
      })

      allowedItems.teamLeadOf = allowedItems.teamLeadOf.map(x=>{
        return typeof(x) === 'object'? x._id : x
      })

      let result = null
      if (this.admin) {
        result = await this.updateMutation('Admin', allowedItems, this.admin._id)
      } else {
        result = await this.createMutation('SignupAdminUser', allowedItems, false)
      }

      if (result) {
        this.back()
        // eslint-disable-next-line no-undef
        swal({
          title: 'Success',
          icon: 'success',
          text: 'Admin User has been successfully saved',
        })
      }
    },
  },
}
</script>
