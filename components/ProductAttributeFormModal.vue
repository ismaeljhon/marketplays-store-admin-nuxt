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
            <ValidationProvider
              v-slot="{ errors }"
              name="Options"
              :rules="'required'"
            >
              <v-autocomplete
                v-model="form.options"
                :items="attributeOptions"
                multiple
                chips
                deletable-chips
                hide-selected
                hide-no-data
                item-text="name"
                return-object
                :error-messages="errors"
              >
                <template slot="label">
                  Options <span class="red--text">*</span>
                </template>
                <template slot="append-outer">
                  <v-btn
                    fab
                    x-small
                    color="primary"
                    @click.prevent="$refs.addAttributeOptionsFormModal.show()"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
              </v-autocomplete>
            </ValidationProvider>
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
    <add-attribute-options-form-modal
      ref="addAttributeOptionsFormModal"
      :current-product-attribute-options="form.options"
      @update="updateAttributeOptions"
    />
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
      name: null,
      description: null,
      options: [],
    },
    item: {},
    isCreate: true,
    attributeOptions: [],
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

      _assign(this, {
        dialog: true,
        isCreate,
        item,
      })

      _assign(this.form, JSON.parse(JSON.stringify(item)))

      if (!isCreate && !this.attributeOptions.length) {
        this.attributeOptions = this.item.options
      }
    },
    reset() {
      _assign(this, {
        dialog: false,
        form: {
          name: null,
          description: null,
          options: [],
        },
        isCreate: true,
        attributeOptions: [],
      })
      this.$refs.observer.reset()
    },
    submit() {
      if (
        this.isCreate &&
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
    updateAttributeOptions(option) {
      this.form.options.push(option)
      this.attributeOptions.push(option)
      this.$refs.observer.reset()
    },
  },
}
</script>
