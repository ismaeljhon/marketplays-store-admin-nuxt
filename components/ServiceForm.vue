<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <v-card>
        <v-card-title>General Information</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="6">
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
              <ValidationProvider
                v-slot="{ errors }"
                name="Workforce Threshold"
                :rules="'required|numeric'"
              >
                <v-text-field
                  v-model="form.workforceThreshold"
                  type="number"
                  :error-messages="errors"
                >
                  <template slot="label">
                    Workforce Threshold <span class="red--text">*</span>
                  </template>
                </v-text-field>
              </ValidationProvider>
              <v-text-field
                v-model="form.shortDescription"
                label="Short Description"
              >
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
                >
                  <template slot="label">
                    Pricing <span class="red--text">*</span>
                  </template>
                </v-text-field>
              </ValidationProvider>
              <v-autocomplete
                v-model="form.tags"
                :items="tags"
                multiple
                chips
                deletable-chips
                hide-selected
                hide-no-data
                label="Tags"
              >
                <template slot="append-outer">
                  <v-btn
                    fab
                    x-small
                    color="primary"
                    @click.prevent="$refs.addTagFormModal.show()"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
              </v-autocomplete>
              <add-tag-form-modal ref="addTagFormModal" @save="updateTags" />
            </v-col>
            <v-col cols="12">
              <p class="my-2">Description</p>
              <vue-editor v-model="form.description"></vue-editor>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mt-5">
        <v-card-title>Images</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="text-center">
              <handy-uploader
                card-type="tile"
                :document-attachment.sync="productImageAttachments"
                file-uploader-type="simple"
                :max-file-size="10240"
                :image-compressor="true"
                :image-compress-level="0.8"
                :max-file-count="10"
                badge-counter
                change-file-name
                add-file-description
                file-accept="image/png,image/gif,image/jpeg,image/webp"
                :custom-lang="productImageAttachmentsCustomLang"
                lang="custom"
              ></handy-uploader>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mt-5">
        <v-card-title>SEO</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.seoTitle"
                label="SEO Title"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.seoKeywords"
                label="SEO Keywords"
                hint="Enter keywords related to your form."
                persistent-hint
                class="mb-3"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.seoDescription"
                hint="Type a description that summarizes your form.."
                persistent-hint
                class="mb-5"
                label="SEO Description"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

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
import handyUploader from 'handy-uploader/src/components/handyUploader'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'service-form',
  components: {
    VueEditor,
    handyUploader,
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
  data: () => ({
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
    productImageAttachments: [],
    productImageAttachmentsCustomLang: {
      custom: {
        insertFile: 'Insert Image(s)',
        insertNewFile: 'Click here to add image(s)',
        add: 'Add Image(s)',
        delete: 'Delete',
        edit: 'Update Image',
        deleteDialog: {
          message: 'Are you sure you want to delete the image?',
          cancel: 'cancel',
        },
        size: {
          kb: 'KB',
          mb: 'MB',
        },
        maxFileSizeAlert: 'Max file Size is',
        maxFileCountAlert: 'Max file Count is',
        fileName: 'File Name',
        fileDescription: 'File Description',
        fileTags: 'File Tags',
      },
    },
  }),
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
        newTag: null,
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
      // eslint-disable-next-line no-console
      return console.log(allowedItems)

      // eslint-disable-next-line no-unreachable
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
    updateTags(newTag) {
      if (!this.form.tags.includes(newTag)) this.form.tags.push(newTag)
      if (!this.tags.includes(newTag)) this.tags.push(newTag)
    },
  },
}
</script>
