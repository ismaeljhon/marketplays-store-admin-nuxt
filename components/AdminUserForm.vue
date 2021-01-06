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
import _assign from 'lodash/assign'

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
    },
  }),
  watch: {
    user(value) {
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
          fullName: null,
          email: null,
        },
      })
    },
    async submit() {
      const allowedItems = this.getAllowedItems(this.form, [
        'fullName',
        'email',
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
