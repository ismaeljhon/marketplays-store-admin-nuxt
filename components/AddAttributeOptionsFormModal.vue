<template>
  <v-dialog v-model="dialog" max-width="300" @click:outside="reset">
    <v-card>
      <v-card-title>Add Attribute Options</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(submit)">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Name"
                  vid="attributeOptionName"
                  :rules="'required'"
                >
                  <v-text-field v-model="form.name" :error-messages="errors">
                    <template slot="label">
                      Name <span class="red--text">*</span>
                    </template>
                  </v-text-field>
                </ValidationProvider>
                <div class="mt-2">
                  <v-btn @click.prevent="back">cancel</v-btn>
                  <v-btn color="primary" class="float-right" type="submit"
                    >save</v-btn
                  >
                </div>
              </form>
            </ValidationObserver>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import _assign from 'lodash/assign'
import _find from 'lodash/find'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'add-attribute-options-form-modal',
  props: {
    currentProductAttributeOptions: {
      type: Array,
      default: null,
    },
  },
  data: () => ({
    dialog: false,
    form: {
      name: null,
      code: null,
    },
  }),
  methods: {
    show() {
      this.dialog = true

      const shortUuid = require('short-uuid')
      this.form.code = `opt-${shortUuid.generate()}`
    },
    submit() {
      if (
        _find(this.currentProductAttributeOptions, (o) => {
          return o.name === this.form.name
        })
      ) {
        // eslint-disable-next-line no-undef
        return swal({
          title: 'Error',
          icon: 'error',
          text: 'Option name already exists on this Attribute',
        })
      }

      this.$emit('update', this.form)
      this.reset()
    },
    back() {
      this.dialog = false
      this.reset()
    },
    reset() {
      _assign(this, {
        form: {
          name: null,
          code: null,
        },
        dialog: false,
      })
      this.$refs.observer.reset()
    },
  },
}
</script>
