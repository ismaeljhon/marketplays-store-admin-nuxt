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
            name="Title"
            :rules="'required'"
          >
            <v-text-field
              v-model="form.title"
              :error-messages="errors"
              label="Title"
            ></v-text-field>
          </ValidationProvider>
          <v-text-field
            v-model="form.slug"
            hint="This would be used for pretty url"
            persistent-hint
            class="mb-3"
          >
            <template slot="label"> Url <small>(optional)</small> </template>
          </v-text-field>
          <ValidationProvider
            v-slot="{ errors }"
            name="Job Type"
            :rules="'required'"
          >
            <v-select
              v-model="form.type"
              :items="jobTypes"
              label="Job Type"
              :error-messages="errors"
            ></v-select>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Category"
            :rules="'required'"
          >
            <v-select
              v-model="form.category"
              :items="jobCategories"
              label="Category"
              :error-messages="errors"
              item-text="name"
              item-value="id"
            ></v-select>
          </ValidationProvider>
        </v-col>
        <v-col cols="6">
          <ValidationProvider
            v-slot="{ errors }"
            name="Open for Bid?"
            :rules="'required'"
          >
            <v-select
              v-model="form.biddable"
              :items="canBidItems"
              label="Open for Bid?"
              :error-messages="errors"
            ></v-select>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Currency"
            :rules="'required'"
          >
            <v-autocomplete
              v-model="form.currency"
              :items="currencies"
              item-text="name"
              item-value="code"
              label="Currency"
              placeholder="Please Select Currency"
              :error-messages="errors"
              class="mb-6"
            ></v-autocomplete>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Opening Market Bid Value"
            :rules="'required|numeric|min_value:1'"
          >
            <v-text-field
              v-model="form.openingMarketBid"
              type="number"
              :error-messages="errors"
            >
              <template slot="label">
                Opening Market Bid
                <small v-if="form.currency">(in {{ form.currency }})</small>
              </template>
            </v-text-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            name="Timeframe"
            :rules="'required|numeric|min_value:1'"
          >
            <v-text-field
              v-model="form.timeframe"
              type="number"
              :error-messages="errors"
            >
              <template slot="label">
                Timeframe <small>(in minutes)</small>
              </template>
            </v-text-field>
          </ValidationProvider>
        </v-col>
        <v-col cols="12">
          <ValidationProvider
            v-slot="{ errors }"
            name="Required Certificates"
            :rules="'required'"
          >
            <v-autocomplete
              v-model="form.requiredCertificates"
              :items="requiredCertificates"
              item-text="name"
              item-value="code"
              label="Required Certificates"
              :error-messages="errors"
              chips
              multiple
            ></v-autocomplete>
          </ValidationProvider>
          <v-textarea v-model="form.description" label="Description">
            <template slot="label">
              Description <small>(optional)</small>
            </template>
          </v-textarea>
          <p class="my-2">Instructions <small>(optional)</small></p>
          <vue-editor v-model="form.instructions"></vue-editor>
        </v-col>
        <v-col cols="12">
          <h3 class="mb-2">SEO</h3>
          <v-divider class="mb-5"></v-divider>
          <v-text-field v-model="form.seoTitle">
            <template slot="label">
              SEO Title <small>(optional)</small>
            </template>
          </v-text-field>
          <v-text-field
            v-model="form.seoKeywords"
            label="SEO Keywords"
            hint="Enter keywords related to your product."
            persistent-hint
            class="mb-3"
          >
            <template slot="label">
              SEO Keywords <small>(optional)</small>
            </template>
          </v-text-field>
          <v-textarea
            v-model="form.seoDescription"
            hint="Type a description that summarizes your product.."
            persistent-hint
          >
            <template slot="label">
              SEO Description <small>(optional)</small>
            </template>
          </v-textarea>
        </v-col>
      </v-row>

      <div class="mt-2">
        <v-btn @click.prevent="reset">cancel</v-btn>
        <v-btn color="primary" type="submit" class="float-right">Save</v-btn>
      </div>
    </form>
  </ValidationObserver>
</template>
<script>
import gql from 'graphql-tag'
import _assign from 'lodash/assign'
import RequiredCertificates from '@/assets/required_certificates'
import { VueEditor } from 'vue2-editor'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'job-form',
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
    jobCategories: {
      query: gql`
        query {
          jobCategories {
            _id
            name
          }
        }
      `,
      update(data) {
        return data.jobCategories
      },
    },
  },
  props: {
    job: {
      type: Object,
      default: null,
    },
    previousPage: {
      type: String,
      default: '/jobs',
    },
  },
  data: () => ({
    form: {
      title: null,
      slug: null,
      description: null,
      instructions: null,
      biddable: null,
      openingMarketBid: null,
      type: null,
      timeframe: null, // in minutes
      seoTitle: null,
      seoKeywords: null,
      seoDescription: null,
      currency: null,
      requiredCertificates: [],
      category: null,
    },
    currencies: [],
    canBidItems: [
      { value: true, text: 'Yes' },
      { value: false, text: 'No' },
    ],
    requiredCertificates: RequiredCertificates,
    jobTypes: ['Project-Based', 'Hourly Rate'],
  }),
  watch: {
    job(value) {
      if (value) this.form = value
    },
  },
  mounted() {
    this.currencies = this.getCurrencies()
    console.log(this.$route.query.serviceRequestId)
  },
  methods: {
    back() {
      this.$router.push(this.previousPage)
      this.resetForm()
    },
    resetForm() {
      _assign(this, {
        form: {
          title: null,
          slug: null,
          description: null,
          instructions: null,
          biddable: null,
          openingMarketBid: null,
          type: null,
          timeframe: null, // in minutes
          seoTitle: null,
          seoKeywords: null,
          seoDescription: null,
          currency: null,
          requiredCertificates: [],
          category: null,
        },
      })
    },
    async submit() {
      this.form.openingMarketBid = parseFloat(this.form.openingMarketBid)
      this.form.timeframe = parseFloat(this.form.timeframe)
      const allowedItems = this.getAllowedItems(this.form, [
        'title',
        'slug',
        'description',
        'instructions',
        'biddable',
        'openingMarketBid',
        'type',
        'timeframe',
        'seoTitle',
        'seoKeywords',
        'seoDescription',
        'currency',
        'requiredCertificates',
        'category',
      ])
      let result = null
      if (this.job) {
        result = await this.updateMutation('Job', allowedItems, this.job._id)
      } else {
        result = await this.createMutation('Job', allowedItems)
      }

      if (result) {
        this.back()
        // eslint-disable-next-line no-undef
        swal({
          title: 'Success',
          icon: 'success',
          text: 'Job has been successfully saved',
        })
      }
    },
  },
}
</script>
