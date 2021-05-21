<template>
  <section id="service-form" class="service-form">
    <ValidationObserver ref="observer" v-slot="{ handleSubmit, invalid }">
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
                  class="mb-4"
                ></v-text-field>
                <v-autocomplete
                  v-model="form.category"
                  :items="categories"
                  hide-no-data
                  item-text="name"
                  item-value="_id"
                  label="Category"
                  placeholder="Select Category"
                ></v-autocomplete>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Code"
                  :rules="'required'"
                >
                  <v-text-field
                    v-model="form.code"
                    :error-messages="errors"
                    class="mb-3"
                    :disabled="!form.category"
                  >
                    <template v-if="serviceCodePrefix" slot="prepend-inner">
                      <v-btn depressed class="mr-2">
                        {{ serviceCodePrefix }}
                      </v-btn>
                    </template>
                    <template slot="label">
                      <span v-if="form.category"> Service code </span>
                      <span v-else>Please select category first </span>
                      <span class="red--text">*</span>
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
                <v-row class="mb-2">
                  <v-col class="py-0">
                    <v-switch label="Show in Store?" color="success"></v-switch>
                  </v-col>
                  <v-col class="pa-0">
                    <v-switch
                      label="Set as Enquiry Only"
                      color="success"
                      hint="If set to yes, this service cannot be purchased"
                      persistent-hint
                    ></v-switch>
                  </v-col>
                </v-row>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Pricing"
                  :rules="'required|numeric'"
                >
                  <v-text-field
                    v-model="form.pricing"
                    type="number"
                    :error-messages="errors"
                    class="mb-4"
                  >
                    <template slot="label">
                      Pricing <span class="red--text">*</span>
                    </template>
                  </v-text-field>
                </ValidationProvider>
                <v-autocomplete
                  v-model="form.projectManager"
                  :items="projectManagers"
                  hide-no-data
                  :item-text="
                    (item) =>
                      `${item.firstName} ${item.middleName} ${item.lastName}`
                  "
                  item-value="_id"
                  label="Product Manager"
                  placeholder="Select Product Manager"
                ></v-autocomplete>
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
              <v-col cols="12">
                <v-alert prominent text type="info">
                  First image would be selected as a featured image
                </v-alert>
                <VueFileAgent
                  ref="vueFileAgent"
                  v-model="form.files"
                  :theme="'grid'"
                  multiple
                  deletable
                  sortable="handle"
                  meta
                  :accept="'image/jpeg'"
                  :max-size="'10MB'"
                  :max-files="14"
                  :help-text="'Choose images'"
                  :error-text="{
                    type: 'Invalid file type. Only images Allowed',
                    size: 'Files should not exceed 10MB in size',
                  }"
                  @select="filesSelected($event)"
                  @beforedelete="onBeforeDelete($event)"
                  @delete="fileDeleted($event)"
                  name="files"
                ></VueFileAgent>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="mt-5">
                <v-btn
                  color="primary"
                  class="float-right"
                  :disabled="!fileRecordsForUpload.length"
                  @click="uploadFiles()"
                  >Upload {{ fileRecordsForUpload.length }}
                  {{
                    fileRecordsForUpload.length > 1 ? 'files' : 'file'
                  }}</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mt-5">
          <v-card-title>Videos</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <no-data-message message="No Video available" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mt-5">
          <v-card-title>
            Attributes
            <v-spacer></v-spacer>
            <v-btn
              small
              class="ml-2"
              color="primary"
              @click.prevent="showAttributeModal()"
            >
              <v-icon left>mdi-plus</v-icon> New Attribute
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="productAttributeTableHeader"
                  :items="form.attributes"
                >
                  <template slot="item.attribute.name" slot-scope="row">
                    {{ row.item.attribute.name }}
                  </template>
                  <template slot="item.attribute.description" slot-scope="row">
                    {{ row.item.attribute.name }}
                  </template>
                  <template slot="item.options" slot-scope="row">
                    {{ row.item.options | concat_names }}
                  </template>
                  <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          small
                          icon
                          v-bind="attrs"
                          color="primary"
                          v-on="on"
                          @click.prevent="showAttributeModal(row.item, false)"
                        >
                          <v-icon>mdi-square-edit-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Edit this item</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          small
                          icon
                          v-bind="attrs"
                          color="error"
                          v-on="on"
                          @click.prevent="deleteAttribute(row.item)"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete this item</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mt-5">
          <v-card-title>
            Variants
            <v-spacer></v-spacer>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-data-table
                  :headers="productVariantsTableHeader"
                  :items="form.variants"
                >
                  <template slot="item.pricing" slot-scope="row">
                    <ValidationProvider
                      v-slot="{ errors }"
                      :name="`${row.item.name} pricing`"
                      :rules="'required|min:1|numeric'"
                    >
                      <v-text-field
                        v-model="row.item.pricing"
                        :error-messages="errors"
                        type="number"
                      >
                        <template slot="label">
                          Pricing <span class="red--text">*</span>
                        </template>
                      </v-text-field>
                    </ValidationProvider>
                  </template>
                  <template slot="item.description" slot-scope="row">
                    <v-text-field v-model="row.item.description"></v-text-field>
                  </template>
                  <template slot="item.isEnquiry" slot-scope="row">
                    <v-switch v-model="row.item.isEnquiry"></v-switch>
                  </template>
                  <template slot="item.action" slot-scope="row">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          small
                          icon
                          v-bind="attrs"
                          color="error"
                          v-on="on"
                          @click.prevent="deleteAttribute(row.item)"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete this item</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
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

        <div class="mt-5">
          <v-btn @click.prevent="back">cancel</v-btn>
          <v-btn
            color="primary"
            type="submit"
            class="float-right"
            :disabled="invalid"
            >save</v-btn
          >
        </div>
      </form>
    </ValidationObserver>

    <add-tag-form-modal ref="addTagFormModal" @save="updateTags" />
    <product-attribute-form-modal
      ref="productAttributeFormModal"
      :current-product-attributes="form.attributes"
      @update="updateProductAttribute"
    />
  </section>
</template>
<style>
.swal-text {
  text-align: center;
}
</style>
<script>
import gql from 'graphql-tag'
import _assign from 'lodash/assign'
import _filter from 'lodash/filter'
import _forEach from 'lodash/forEach'
import _has from 'lodash/has'
import _find from 'lodash/find'
import { VueEditor } from 'vue2-editor'
import Config from '~/config'
import { merge as _merge } from 'lodash'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'service-form',
  components: {
    VueEditor,
  },
  apollo: {
    admins: {
      query: gql`
        query {
          admins {
            _id
            firstName
            middleName
            lastName
          }
        }
      `,
      update(data) {
        return data.admins
      },
    },
    categories: {
      query: gql`
        query {
          categories {
            _id
            name
            code
          }
        }
      `,
      update(data) {
        return data.categories
      },
    },
    files: {
      query: gql`
        query {
          files {
            _id
            path
            file
          }
        }
      `,
    },
  },
  props: {
    service: {
      type: Object,
      default: null,
    },
    files: {
      type: Array,
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
      code: null,
      description: null,
      shortDescription: null,
      pricing: null,
      enquireOnly: false,
      showInStore: true,
      tags: [],
      files: [],
      slug: null,
      workforceThreshold: 100,
      seoTitle: null,
      seoKeywords: null,
      seoDescription: null,
      projectManager: null,
      category: null,
      attributes: [],
      variants: [],
    },
    tags: ['seo', 'web', 'web development', 'web design', 'graphics'],
    productImageAttachments: [],
    fileURL: Config[process.env.NODE_ENV]
      ? Config[process.env.NODE_ENV].API_BASE_URL + '/files/'
      : Config.dev.API_BASE_URL + '/files/',

    uploadedImages: [],
    fileRecords: [], //used form.files instead for VueFileAgent v-model
    uploadUrl: Config[process.env.NODE_ENV]
      ? Config[process.env.NODE_ENV].API_BASE_URL + '/uploadFiles'
      : Config.dev.API_BASE_URL + '/uploadFiles',
    uploadHeaders: {},
    fileRecordsForUpload: [], // maintain an upload queue
    productAttributeTableHeader: [
      { text: 'Name', align: 'start', value: 'name', width: '300px' },
      { text: 'Options', align: 'start', value: 'options' },
      {
        text: 'Description',
        align: 'start',
        value: 'description',
        width: '300px',
      },
      {
        text: 'Actions',
        align: 'start',
        sortable: false,
        value: 'action',
        width: '150px',
      },
    ],
    productVariantsTableHeader: [
      { text: 'Name', align: 'start', value: 'name', width: '200px' },
      {
        text: 'Description',
        align: 'start',
        value: 'description',
        width: '300px',
      },
      { text: 'Pricing (*)', align: 'start', value: 'pricing', width: '200px' },
      { text: 'Set as Enquiry Only', align: 'start', value: 'isEnquiry' },
      {
        text: 'Actions',
        align: 'start',
        sortable: false,
        value: 'action',
        width: '150px',
      },
    ],
  }),
  computed: {
    serviceCodePrefix() {
      const categorySelected = _find(
        this.categories,
        (o) => o._id === this.form.category
      )
      return categorySelected ? `${categorySelected.code}-` : null
    },

    projectManagers() {
      return (
        this.admins &&
        this.admins.map((x) => {
          return _merge(x, {
            fullName: `${[x.firstName, x.middleName, x.lastName].join(' ')}`,
          })
        })
      )
    },
  },
  watch: {
    service(value) {
      if (value) {
        if (value.code) {
          value.code = value.code.split('-')[1]
        }
        _assign(this.form, value)
      }
    },
    files(value) {

      this.fileRecords = []
      if (value) {
        
        //fetch files from the server's '/uploads' directory
        this.form.files = this.form.files.map((file, idx) => {
          if (file.filename) {
            return {
              name: file.filename,
              size: file.size,
              type: file.mimetype,
              ext: file.filename.slice(file.filename.length - 3),
              url: this.fileURL + file.filename,
            }
          } else {
            let name = file.file.name
            return {
              name: name,
              size: file.size,
              type:  file.file.type,
              ext: name.slice(name.length - 3),
              url: this.fileURL + name,
            }
          }
        })
      }
      this.uploadedImages = this.form.files
      this.fileRecords = this.form.files
    },
  },
  methods: {
    urltoFile(url, filename, mimeType) {
      return fetch(url)
        .then(function (res) {
          return res.arrayBuffer()
        })
        .then(function (buf) {
          return new File([buf], filename, { type: mimeType })
        })
    },
    back() {
      this.$router.push(this.previousPage)
      this.resetForm()
    },
    showAttributeModal(item = {}, isCreate = true) {
      this.$refs.productAttributeFormModal.show(item, isCreate)
    },
    resetForm() {
      _assign(this, {
        form: {
          name: null,
          code: null,
          description: null,
          shortDescription: null,
          pricing: null,
          enquireOnly: false,
          showInStore: true,
          tags: [],
          files: [],
          slug: null,
          workforceThreshold: 100,
          seoTitle: null,
          seoKeywords: null,
          seoDescription: null,
          projectManager: null,
          category: null,
          attributes: [],
          variants: [],
        },
        newTag: null,
      })
    },
    async submit() {
      
      this.form.pricing = parseFloat(this.form.pricing)
      this.form.workforceThreshold = parseFloat(this.form.workforceThreshold)
      this.form.code = this.serviceCodePrefix + this.form.code

      var allowedItems = this.getAllowedItems(this.form, [
        'name',
        'code',
        'description',
        'shortDescription',
        'pricing',
        // 'enquireOnly',
        // 'showInStore',
        'files',
        'tags',
        'slug',
        'workforceThreshold',
        'seoTitle',
        'seoKeywords',
        'seoDescription',
        'projectManager',
        'category',
        'attributes',
        'variants',
      ])


      allowedItems.files = this.uploadedImages

      //construct AttributeInput accordingly
      if (allowedItems.attributes) {
        allowedItems.attributes.forEach((attribute, idx) => {
          attribute.options.forEach((opt, idx) => {
            attribute.options[idx] = {
              name: opt.name,
              code: opt.name,
            }
          })

          const attrInput = {
            attribute: {
              name: attribute.name,
              code: attribute.name,
            },
            options: attribute.options,
          }
          allowedItems.attributes[idx] = attrInput
        })
      }

      //construct VariantInput accordingly
      if (allowedItems.variants) {
        allowedItems.variants.forEach((variant, idx) => {
          //construct proper VariantAttributeData
          variant.attributeData.forEach((data, k) => {
            const attrData = {
              attribute: data.attribute.code,
              option: data.option.code,
            }

            variant.attributeData[k] = attrData
          })

          const variantInput = {
            name: variant.name,
            code: variant.code,
            description: variant.description,
            pricing: parseFloat(variant.pricing),
            attributeData: variant.attributeData,
          }

          allowedItems.variants[idx] = variantInput
        })
      }
      // eslint-disable-next-line no-console

      // eslint-disable-next-line no-unreachable
      let result = null

      if (this.service) {
        // result = await this.updateMutation('File', allowedItems.files)

        result = await this.updateMutation(
          'Service',
          allowedItems,
          this.service._id
        )
      } else {
        // result = await this.createMutation('File', allowedItems.files)

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
    uploadFiles() {
      let self = this
      this.$refs.vueFileAgent
        .upload(
          this.uploadUrl,
          this.uploadHeaders,
          this.fileRecordsForUpload,
          function createFormData(fileData) {
            var formData = new FormData()
            formData.append('files', fileData.file)
            return formData
          }
        )
        .then((res) => {
          res.forEach((item) => {
            let file = item.data.files[0]
            file.url = this.fileURL + file.filename
            self.uploadedImages.push(file)
          })
        })

      this.fileRecordsForUpload = []
    },
    deleteUploadedFile(fileRecord) {
      // Using the default uploader. You may use another uploader instead.
      this.$refs.vueFileAgent.deleteUpload(
        this.uploadUrl,
        this.uploadHeaders,
        fileRecord
      )
    },
    filesSelected(fileRecordsNewlySelected) {
      const validFileRecords = fileRecordsNewlySelected.filter(
        (fileRecord) => !fileRecord.error
      )
      this.fileRecordsForUpload = this.fileRecordsForUpload.concat(
        validFileRecords
      )
    },
    onBeforeDelete(fileRecord) {
      const i = this.fileRecordsForUpload.indexOf(fileRecord)
      if (i !== -1) {
        // queued file, not yet uploaded. Just remove from the arrays
        this.fileRecordsForUpload.splice(i, 1)
        const k = this.form.files.indexOf(fileRecord)
        if (k !== -1) this.form.files.splice(k, 1)
      } else if (confirm('Are you sure you want to delete?')) {
        this.$refs.vueFileAgent.deleteFileRecord(fileRecord) // will trigger 'delete' event
      }
    },
    fileDeleted(fileRecord) {
      const i = this.fileRecordsForUpload.indexOf(fileRecord)
      if (i !== -1) {
        this.fileRecordsForUpload.splice(i, 1)
      } else {
        this.deleteUploadedFile(fileRecord)
      }
    },
    async updateProductAttribute(attribute) {
      // eslint-disable-next-line no-console
      let itemFound = false
      _forEach(this.form.attributes, (item) => {
        if (attribute.name === item.name) {
          _assign(item, attribute)
          itemFound = true
        }
      })

      if (!itemFound) this.form.attributes.push(attribute)

      const variantsData = await this.generateVariantsData(this.form.attributes)

      this.form.variants = variantsData.map((variant) => {
        return {
          name: variant.name,
          code: variant.code,
          description: null,
          pricing: 0.0,
          // isEnquiry: false,
          attributeData: variant.attributeData,
        }
      })
    },
    deleteAttribute(item) {
      // eslint-disable-next-line no-undef

      swal({
        title: 'Are you sure?',
        text: _has(item, 'attributeData')
          ? `You are about to delete variant '${item.name}'`
          : `You are about to delete attribute '${item.name}'. This will also remove all variants data below.`, //variant if item has attributeData, attribute otherwise
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.form.attributes = _filter(this.form.attributes, (i) => {
            return item.name !== i.name
          })

          //clear variants when deleting attribute
          if (!_has(item, 'attributeData')) {
            this.form.variants = []
          }

          this.form.variants = _filter(this.form.variants, (i) => {
            return item.name !== i.name
          })
        }
      })
    },
  },
}
</script>
