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
            <v-text-field
              v-model="form.name"
              :error-messages="errors"
              label="Name"
            ></v-text-field>
          </ValidationProvider>
          <v-text-field
            v-model="form.shortDescription"
            label="Short Description"
          ></v-text-field>
          <v-textarea v-model="form.description" label="Description">
            <template slot="label">
              Description <small>(optional)</small>
            </template>
          </v-textarea>
          <v-select
            v-model="form.policy"
            :items="policies"
            :menu-props="{ maxHeight: '400' }"
            label="Policies"
            multiple
            hint="Select Policies"
            persistent-hint
          ></v-select>
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
  name: 'subscription-type-form',
  props: {
    subscriptionType: {
      type: Object,
      default: null,
    },
    previousPage: {
      type: String,
      default: '/subscription-types',
    },
  },
  data: () => ({
    form: {
      name: null,
      description: null,
      shortDescription: null,
      policy: [],
    },
    policies: [
      'Lorem Ipsum',
      'Lorem Ipsum1',
      'Lorem Ipsum2',
      'Lorem Ipsum3',
      'Lorem Ipsum4',
    ],
  }),
  watch: {
    subscriptionType(value) {
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
          description: null,
          shortDescription: null,
          policy: [],
        },
      })
    },
    async submit() {
      const allowedItems = this.getAllowedItems(this.form, [
        'name',
        'description',
        'shortDescription',
        'policy',
      ])

      let result = null
      if (this.subscriptionType) {
        result = await this.updateMutation(
          'SubscriptionType',
          allowedItems,
          this.subscriptionType._id
        )
      } else {
        result = await this.createMutation('SubscriptionType', allowedItems)
      }

      if (result) {
        this.back()
        // eslint-disable-next-line no-undef
        swal({
          title: 'Success',
          icon: 'success',
          text: 'Subscription Type has been successfully saved',
        })
      }
    },
  },
}
</script>
