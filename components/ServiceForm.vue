<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <v-row>
        <v-col cols="12">
          <h3 class="mb-2">General Information</h3>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="6">
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
            v-model="form.slug"
            label="Url"
            hint="This would be used for pretty url"
            persistent-hint
            class="mb-3"
          ></v-text-field>
          <ValidationProvider
            v-slot="{ errors }"
            name="Workforce Threshold"
            :rules="'required|numeric'"
          >
            <v-text-field
              v-model="form.workforceThreshold"
              type="number"
              :error-messages="errors"
              label="Workforce Threshold"
            ></v-text-field>
          </ValidationProvider>
          <v-text-field v-model="form.shortDescription">
            <template slot="label">
              Short Description <small>(optional)</small>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-autocomplete
            v-model="form.department"
            :items="departments"
            hide-no-data
            item-text="name"
            item-value="_id"
            label="Department"
            placeholder="Select Department"
          ></v-autocomplete>
          <v-autocomplete
            v-model="form.projectManager"
            :items="users"
            hide-no-data
            item-text="fullName"
            item-value="_id"
            label="Product Manager"
            placeholder="Select Product Manager"
          ></v-autocomplete>
          <ValidationProvider
            v-slot="{ errors }"
            name="Pricing"
            :rules="'required|numeric'"
          >
            <v-text-field
              v-model="form.pricing"
              type="number"
              :error-messages="errors"
              label="Pricing"
            ></v-text-field>
          </ValidationProvider>
          <v-autocomplete
            v-model="form.tags"
            :items="tags"
            multiple
            chips
            deletable-chips
            hide-selected
            persistent-hint
            hide-no-data
            hint="Type then press comma (,) to add"
            :search-input.sync="searchInput"
            @keydown="processTagsInput"
          >
            <template slot="label"> Tags <small>(optional)</small> </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12">
          <p class="my-2">Description <small>(optional)</small></p>
          <vue-editor v-model="form.description"></vue-editor>
        </v-col>

        <v-col cols="12" class="mt-5">
          <h3 class="mb-2">SEO</h3>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="form.seoTitle">
            <template slot="label">
              SEO Title <small>(optional)</small>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.seoKeywords"
            label="SEO Keywords"
            hint="Enter keywords related to your form."
            persistent-hint
            class="mb-3"
          >
            <template slot="label">
              SEO Keywords <small>(optional)</small>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="form.seoDescription"
            hint="Type a description that summarizes your form.."
            persistent-hint
            class="mb-5"
          >
            <template slot="label">
              SEO Description <small>(optional)</small>
            </template>
          </v-textarea>
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
import { VueEditor } from 'vue2-editor'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'department-form',
  components: {
    VueEditor,
  },
  apollo: {
    users: {
      query: gql`
        query {
          users {
            _id
            fullName
          }
        }
      `,
      update(data) {
        return data.users
      },
    },
    departments: {
      query: gql`
        query {
          departments {
            _id
            name
          }
        }
      `,
      update(data) {
        return data.departments
      },
    },
  },
  props: {
    service: {
      type: Object,
      default: null,
    },
    previousPage: {
      type: String,
      default: '/services',
    },
  },
  data() {
    return {
      form: {
        name: null,
        description: null,
        shortDescription: null,
        pricing: null,
        tags: [],
        slug: null,
        workforceThreshold: 100,
        seoTitle: null,
        seoKeywords: null,
        seoDescription: null,
        projectManager: null,
        department: null,
      },
      tags: ['seo', 'web', 'web development', 'web design', 'graphics'],
      tagDelimiter: ',',
      searchInput: null,
    }
  },
  watch: {
    service(value) {
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
          pricing: null,
          tags: [],
          slug: null,
          workforceThreshold: null,
          seoTitle: null,
          seoKeywords: null,
          seoDescription: null,
          projectManager: null,
          department: null,
        },
      })
    },
    async submit() {
      this.form.pricing = parseFloat(this.form.pricing)
      this.form.workforceThreshold = parseFloat(this.form.workforceThreshold)
      const allowedItems = this.getAllowedItems(this.form, [
        'name',
        'description',
        'shortDescription',
        'pricing',
        'tags',
        'slug',
        'workforceThreshold',
        'seoTitle',
        'seoKeywords',
        'seoDescription',
        'projectManager',
        'department',
      ])

      let result = null
      if (this.service) {
        result = await this.updateMutation(
          'Service',
          allowedItems,
          this.service._id
        )
      } else {
        result = await this.createMutation('Service', allowedItems)
      }

      if (result) {
        this.back()
        // eslint-disable-next-line no-undef
        swal({
          title: 'Success',
          icon: 'success',
          text: 'Service has been successfully saved',
        })
      }
    },
    processTagsInput(element) {
      const newValue = element.target.value.replaceAll(this.tagDelimiter, '')

      if (
        newValue &&
        element.key === this.tagDelimiter &&
        !this.form.tags.includes(newValue)
      ) {
        this.form.tags.push(newValue)
        this.tags.push(newValue)
      }

      if (element.target.value === this.tagDelimiter) {
        this.searchInput = null
      }
    },
  },
}
</script>
