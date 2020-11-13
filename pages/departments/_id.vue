<template>
  <v-row>
    <v-col cols="12">
      <h1 class="font-weight-regular">{{ title }}</h1>
    </v-col>
    <v-col cols="12">
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submit)">
          <v-row>
            <v-col cols="12">
              <h4 class="mb-2">General Information</h4>
              <v-divider class="mb-5"></v-divider>
              <v-autocomplete
                v-model="department.teamLead"
                :items="users"
                hide-no-data
                item-text="fullName"
                item-value="_id"
                placeholder="Select Team Lead from the users"
              >
                <template slot="label">
                  Team Lead <small>(optional)</small>
                </template>
              </v-autocomplete>
              <ValidationProvider
                v-slot="{ errors }"
                name="Code"
                :rules="'required'"
              >
                <v-text-field
                  v-model="department.code"
                  :error-messages="errors"
                  label="Code"
                ></v-text-field>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Name"
                :rules="'required'"
              >
                <v-text-field
                  v-model="department.name"
                  :error-messages="errors"
                  label="Name"
                ></v-text-field>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Slug"
                :rules="'required'"
              >
                <v-text-field
                  v-model="department.slug"
                  :error-messages="errors"
                  label="Url"
                  hint="This would be used for pretty url"
                  persistent-hint
                  class="mb-3"
                ></v-text-field>
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                name="Pricing"
                :rules="'required|numeric'"
              >
                <v-text-field
                  v-model="department.pricing"
                  type="number"
                  :error-messages="errors"
                  label="Pricing"
                ></v-text-field>
              </ValidationProvider>
              <v-textarea v-model="department.description" label="Description">
                <template slot="label">
                  Description <small>(optional)</small>
                </template>
              </v-textarea>
            </v-col>
            <v-col cols="12">
              <h4 class="mb-2">SEO</h4>
              <v-divider class="mb-5"></v-divider>
              <v-text-field v-model="department.seoTitle">
                <template slot="label">
                  SEO Title <small>(optional)</small>
                </template>
              </v-text-field>
              <v-text-field
                v-model="department.seoKeywords"
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
                v-model="department.seoDescription"
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
            <v-btn color="primary" type="submit" class="float-right"
              >save</v-btn
            >
          </div>
        </form>
      </ValidationObserver>
    </v-col>
  </v-row>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'EditDepartment',
  async fetch() {
    await this.$apollo.queries.department.start()
  },
  data: () => ({
    department: {
      name: null,
      code: null,
      description: null,
      slug: null,
      pricing: null,
      seoTitle: null,
      seoKeywords: null,
      seoDescription: null,
      teamLead: {
        _id: null,
      },
    },
  }),
  apollo: {
    department: {
      query: gql`
        query department($id: MongoID!) {
          department(_id: $id) {
            _id
            name
            code
            slug
            description
            pricing
            seoTitle
            seoDescription
            seoKeywords
            teamLead {
              _id
            }
          }
        }
      `,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
      update(data) {
        if (data.department.teamLead) {
          data.department.teamLead = data.department.teamLead._id
        }
        return data.department
      },
      skip() {
        return true
      },
    },
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
  },
  computed: {
    title() {
      return `Edit Department - ${this.department.name || ''}`
    },
  },
  mounted() {
    this.$store.commit('showAsideDrawer', false)
  },
  methods: {
    back() {
      this.$router.push('/departments')
      this.$store.commit('showAsideDrawer', true)
    },
  },
}
</script>
