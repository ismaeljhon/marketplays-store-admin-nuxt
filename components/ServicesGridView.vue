<template>
  <v-row dense>
    <v-col v-if="items.length <= 0" cols="12">
      <v-divider></v-divider>
      <p class="text-center mt-5 d-block"><em>No Data Available</em></p>
    </v-col>

    <v-col v-for="item in items" :key="item.id" cols="3">
      <v-card outlined :raised="item.is_selected">
        <v-img
          :src="
            getFileName(item.files) || require('~/assets/image-placeholder.jpg')
          "
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="200px"
        >
          <v-card-title v-text="item.name"></v-card-title>
        </v-img>

        <v-card-actions>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="error"
                v-bind="attrs"
                v-on="on"
                @click.prevent="$emit('delete', item)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Delete Product</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <NuxtLink :to="'/services/' + item._id">
                <v-btn icon color="primary" v-bind="attrs" v-on="on">
                  <v-icon>mdi-square-edit-outline</v-icon>
                </v-btn>
              </NuxtLink>
            </template>
            <span>Edit this Product</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Config from '~/config'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'product-grid-view',
  props: {
    items: {
      type: [Array, Object],
      default: null,
    },
  },
  data: () => ({
    apiEndpoint: Config[process.env.NODE_ENV]
      ? Config[process.env.NODE_ENV].API_BASE_URL + '/files/'
      : Config.dev.API_BASE_URL + '/files/',
  }),
  methods: {
    getFileName(files) {
      
      if (files && files.length > 0 && files[0]) {
        let file = files[0]
        let name = file.filename ? file.filename : file.file.name
        return this.apiEndpoint + name
      }
      return ''
    },
  },
}
</script>
