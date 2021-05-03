<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <v-row>
        <v-col cols="6">
          <h4 class="mb-2">General Information</h4>
          <v-divider class="mb-5"></v-divider>
          <v-autocomplete
            v-model="form.teamLead"
            :items="users"
            hide-no-data
            :item-text="
              (item) => `${item.firstName} ${item.middleName} ${item.lastName}`
            "
            item-value="_id"
            placeholder="Select Team Lead from the users"
            label="Team Lead"
          ></v-autocomplete>
          <ValidationProvider
            v-slot="{ errors }"
            name="Code"
            :rules="'required'"
          >
            <v-text-field v-model="form.code" :error-messages="errors">
              <template slot="label">
                Code <span class="red--text">*</span>
              </template>
            </v-text-field>
          </ValidationProvider>
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
          <v-text-field
            v-model="form.slug"
            label="Url"
            hint="This would be used for pretty url"
            persistent-hint
            class="mb-3"
          ></v-text-field>
          <v-textarea
            v-model="form.description"
            label="Description"
          ></v-textarea>
        </v-col>
        <v-col cols="6">
          <h4 class="mb-2">SEO</h4>
          <v-divider class="mb-5"></v-divider>
          <v-text-field v-model="form.seoTitle" label="SEO Title">
          </v-text-field>
          <v-text-field
            v-model="form.seoKeywords"
            label="SEO Keywords"
            hint="Enter keywords related to your product."
            persistent-hint
            class="mb-3"
          ></v-text-field>
          <v-textarea
            v-model="form.seoDescription"
            hint="Type a description that summarizes your product.."
            persistent-hint
            label="SEO Description"
          ></v-textarea>
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
  name: 'category-form',
  apollo: {
    users: {
      query: gql`
        query {
          users {
            _id
            firstName
            middleName
            lastName
          }
        }
      `,
      update(data) {
        return data.users
      },
    },
  },
  props: {
    category: {
      type: Object,
      default: null,
    },
    previousPage: {
      type: String,
      default: '/categories',
    },
  },
  data: () => ({
    form: {
      name: null,
      code: null,
      description: null,
      slug: null,
      seoTitle: null,
      seoKeywords: null,
      seoDescription: null,
      teamLead: null,
    },
  }),
  watch: {
    category(value) {
      if (value) this.form = value
    },
  },
  methods: {
    back() {
      this.$router.push(this.previousPage)
      this.resetForm()
    },
    getFullName() {
      console.log(id)
      return 'Test'
    },
    resetForm() {
      _assign(this, {
        form: {
          name: null,
          code: null,
          description: null,
          slug: null,
          seoTitle: null,
          seoKeywords: null,
          seoDescription: null,
          teamLead: null,
        },
      })
    },
    async submit() {
      this.form.pricing = parseFloat(this.form.pricing)
      const allowedItems = this.getAllowedItems(this.form, [
        'name',
        'code',
        'description',
        'slug',
        'seoTitle',
        'seoKeywords',
        'seoDescription',
        'teamLead',
      ])

      let result = null
      if (this.category) {
        result = await this.updateMutation(
          'Category',
          allowedItems,
          this.category._id
        )
      } else {
        result = await this.createMutation('Category', allowedItems)
      }

      if (result) {
        this.back()
        // eslint-disable-next-line no-undef
        swal({
          title: 'Success',
          icon: 'success',
          text: 'Category has been successfully saved',
        })
      }
    },
  },
}
</script>