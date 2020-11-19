<template>
  <v-dialog v-model="dialog" max-width="700">
    <v-card>
      <v-card-title>Add New Tag</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
              <form @submit.prevent="handleSubmit(submit)">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Name"
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
                  <v-btn color="primary" type="submit" class="float-right"
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

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'add-tag-form-modal',
  data: () => ({
    dialog: false,
    form: {
      name: null,
    },
  }),
  methods: {
    show() {
      this.dialog = true
    },
    submit() {
      this.$emit('save', this.form.name)
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
        },
        dialog: false,
      })
      this.$refs.observer.reset()
    },
  },
}
</script>
