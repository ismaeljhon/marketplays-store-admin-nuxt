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
            <v-text-field v-model="form.fullName" :error-messages="errors">
              <template slot="label">
                Name <span class="red--text">*</span>
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
                v-model="form.hashedPassword"
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
            :items="departments"
            hide-no-data
            item-text="name"
            item-value="_id"
            multiple
            chips
            deletable-chips
            label="Team Lead of department(s):"
          ></v-autocomplete>
          <v-autocomplete
            v-model="form.projectManagerOf"
            :items="servicesWithLabel"
            hide-no-data
            item-text="label"
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
    user: {
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
      fullName: null,
      email: null,
      hashedPassword: null,
      password: null,
      teamLeadOf: [],
      projectManagerOf: [],
    },
    departments: [],
    services: [],
  }),
  computed: {
    isEdit() {
      return Boolean(this.user && this.user._id)
    },
    servicesWithLabel() {
      return this.services.map((o) => {
        return _merge(o, {
          label: `${o.name} (${o.department ? o.department.name : ''})`,
        })
      })
    },
  },
  watch: {
    user(value) {
      if (value) {
        this.form = value
        this.form.teamLeadOf = value.teamLeadOf.map((user) => user._id)
        this.form.projectManagerOf = value.projectManagerOf.map(
          (deparment) => deparment._id
        )
      }
    },
  },
  mounted() {
    this.getList('departments', ['_id', 'name'])
    this.getList('services', ['_id', 'name', 'department { name }'])
  },
  methods: {
    back() {
      this.$router.push(this.previousPage)
      this.resetForm()
    },
    resetForm() {
      _assign(this, {
        form: {
          fullName: null,
          email: null,
          hashedPassword: null,
          password: null,
          teamLeadOf: [],
          projectManagerOf: [],
        },
      })
    },
    async submit() {
      const allowedItems = this.getAllowedItems(this.form, [
        'fullName',
        'email',
        'hashedPassword',
        'teamLeadOf',
        'projectManagerOf',
      ])

      let result = null
      if (this.user) {
        result = await this.updateMutation('User', allowedItems, this.user._id)
      } else {
        result = await this.createMutation('User', allowedItems)
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
