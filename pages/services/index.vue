<template>
  <v-card>
    <v-card-title>
      <v-row dense>
        <v-col cols="5">
          <h3 class="mr-2"><v-icon left>mdi-cogs</v-icon> Services</h3>
        </v-col>
        <v-col cols="7" class="text-right">
          <download-csv
            class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small"
            :data="services"
            style="cursor: pointer"
          >
            <v-icon left>mdi-download</v-icon>Export Services
          </download-csv>
          <NuxtLink to="/services/add">
            <v-btn small color="primary">
              <v-icon left>mdi-plus</v-icon>Add Service
            </v-btn>
          </NuxtLink>
        </v-col>
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
        </v-col>
        <v-col cols="6">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                tile
                icon
                small
                class="mr-2"
                color="primary"
                v-bind="attrs"
                v-on="on"
              >
                <v-tooltip bottom>
                  <!-- eslint-disable-next-line vue/no-template-shadow -->
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on"
                      >mdi-{{ gridOn ? 'view-grid' : 'view-list' }}</v-icon
                    >
                  </template>
                  <span>View</span>
                </v-tooltip>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                :class="gridOn ? 'v-list-item--active' : ''"
                @click.prevent="gridOn = true"
              >
                <v-list-item-title>Grid View</v-list-item-title>
              </v-list-item>
              <v-list-item
                :class="!gridOn ? 'v-list-item--active' : ''"
                @click.prevent="gridOn = false"
              >
                <v-list-item-title>List View</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="search"
            dense
            filled
            single-line
            hide-details
            append-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <loading
        v-if="$apollo.loading"
        loading-text="Loading Service..."
        class="text-center mt-5"
      />
      <div v-else>
        <services-grid-view
          v-if="gridOn"
          :items="services"
          @delete="deleteItems"
        />
        <services-table-list
          v-else
          ref="productTableList"
          :items="services"
          :search="search"
          :options="tableParams.options"
          :item-list-count="itemsCount"
          @refresh="refreshItems"
          @delete="deleteItems"
          @selected="afterSelectedEventsOnTableList"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'Services',
  data: () => ({
    gridOn: true,
    search: null,
    tableParams: {
      model: 'services',
      query: gql`
        {
          _id
          name
          files
          pricing
          files
        }
      `,
    },
    services: [],
  }),
  beforeDestroy() {
    this.clearGetItems()
  },
  mounted() {
    this.getItems()
  },
  methods: {
    deleteItems(items) {
      // eslint-disable-next-line no-undef
      swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this one',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          const result = await this.deleteMutation('Service', items._id)

          if (result) {
            // eslint-disable-next-line no-undef
            swal({
              title: 'Success',
              icon: 'success',
              text: 'Service(s) has been successfully deleted',
            })
            this.getItems()
            this.itemsCount--
          }
        }
      })
    },
    afterSelectedEventsOnTableList(items) {
      this.tableItems.selected = items
    },
    refreshItems(customOptions) {
      this.tableParams.options = customOptions
    },
  },
}
</script>
