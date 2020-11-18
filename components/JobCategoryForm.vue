<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <v-row>
        <v-col cols="6">
          <h3 class="mb-2">General Information</h3>
          <v-divider class="mb-5"></v-divider>
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
        </v-col>
        <v-col cols="6">
          <h3 class="mb-2">SEO</h3>
          <v-divider class="mb-5"></v-divider>
          <v-text-field
            v-model="form.seoTitle"
            label="SEO Title"
          ></v-text-field>
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
        <v-btn color="primary" type="submit" class="float-right">Save</v-btn>
      </div>
    </form>
  </ValidationObserver>
</template>
<script>
import _assign from 'lodash/assign'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'job-category-form',
  props: {
    jobCategory: {
      type: Object,
      default: null,
    },
    previousPage: {
      type: String,
      default: '/job-categories',
    },
  },
  data: () => ({
    form: {
      name: null,
      slug: null,
      seoTitle: null,
      seoKeywords: null,
      seoDescription: null,
    },
  }),
  watch: {
    jobCategory(value) {
      if (value) this.form = value
    },
  },
  methods: {
    back() {
      this.$router.push(this.previousPage)
      this.$store.commit('showAsideDrawer', true)
      this.resetForm()
    },
    resetForm() {
      _assign(this, {
        form: {
          name: null,
          slug: null,
          seoTitle: null,
          seoKeywords: null,
          seoDescription: null,
        },
      })
    },
    async submit() {
      const allowedItems = this.getAllowedItems(this.form, [
        'name',
        'slug',
        'seoTitle',
        'seoKeywords',
        'seoDescription',
      ])

      let result = null
      if (this.jobCategory) {
        result = await this.updateMutation(
          'JobCategory',
          allowedItems,
          this.jobCategory._id
        )
      } else {
        result = await this.createMutation('JobCategory', allowedItems)
      }

      if (result) {
        this.back()
        // eslint-disable-next-line no-undef
        swal({
          title: 'Success',
          icon: 'success',
          text: 'Job Category has been successfully saved',
        })
      }
    },
  },
}
</script>
