<template>
  <v-dialog v-model="dialog" max-width="700" @click:outside="reset">
    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(submit)">
        <v-card>
          <v-card-title>{{ title }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
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
            <v-text-field v-model="form.description" label="Description">
            </v-text-field>
          </v-card-text>
          <v-card-actions class="pa-5">
            <v-btn @click.prevent="reset">cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" class="float-right">
              save
            </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </ValidationObserver>
  </v-dialog>
</template>
<script>
import _assign from 'lodash/assign'
import _find from 'lodash/find'
export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'product-attribute-form-modal',
  props: {
    currentProductAttributes: {
      type: Array,
      default: null,
    },
  },
  data: () => ({
    dialog: false,
    form: {
      code: null,
      name: null,
      description: null,
      options: [],
    },
    item: {},
    isCreate: true,
  }),
  computed: {
    title() {
      return !this.isCreate
        ? 'Edit Product Attribute: ' + this.item.name
        : 'New Product Attribute'
    },
  },
  methods: {
    show(item = {}, isCreate = true) {
      const shortUuid = require('short-uuid')

      _assign(this, {
        form: JSON.parse(JSON.stringify(item)),
        dialog: true,
        isCreate,
        item,
      })

      if (isCreate) this.form.code = `attrib-${shortUuid.generate()}`
    },
    reset() {
      _assign(this, {
        dialog: false,
        form: {
          code: null,
          name: null,
          description: null,
          options: [],
        },
        isCreate: true,
      })
      this.$refs.observer.reset()
    },
    submit() {
      if (
        _find(this.currentProductAttributes, (o) => {
          return o.name === this.form.name
        })
      ) {
        // eslint-disable-next-line no-undef
        return swal({
          title: 'Error',
          icon: 'error',
          text: 'Attribute name already exists on this Product',
        })
      }

      this.$emit('update', this.form)
      this.reset()
    },
  },
}
</script>
