<template>
  <v-card>
    <v-card-title>
      <v-row dense>
        <v-col cols="5">
          <h3 class="mr-2">
            <v-icon left>mdi-briefcase-outline</v-icon> Job Listing
          </h3>
        </v-col>
        <v-col cols="7" class="text-right">
          <download-csv
            class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small"
            :data="jobs"
            style="cursor: pointer"
          >
            <v-icon left>mdi-download</v-icon>Export Jobs
          </download-csv>
          <NuxtLink to="/jobs/add">
            <v-btn small color="primary">
              <v-icon left>mdi-plus</v-icon>Add Job
            </v-btn>
          </NuxtLink>
        </v-col>
        <v-col cols="12">
          <v-divider class="my-2"></v-divider>
        </v-col>
        <v-col cols="6">
          <v-btn
            v-if="hasSelectedItems"
            outlined
            small
            tile
            color="error"
            @click.prevent="deleteItems(tableItems.selected)"
          >
            <v-icon left>mdi-close</v-icon> Delete Selected
          </v-btn>
          <v-spacer v-else></v-spacer>
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
      <v-data-table
        v-model="tableItems.selected"
        :search="search"
        :headers="headers"
        :items="jobs"
        :server-items-length="itemsCount"
        :loading="isLoading"
        loading-text="Loading please wait..."
        :options.sync="tableParams.options"
        @input="afterSelectedEventsOnTableList"
      >
        <template slot="item.action" slot-scope="row">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <NuxtLink :to="'/jobs/' + row.item._id">
                <v-btn small icon v-bind="attrs" color="primary" v-on="on">
                  <v-icon>mdi-square-edit-outline</v-icon>
                </v-btn>
              </NuxtLink>
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
                @click.prevent="deleteItems(row.item)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <span>Delete this item</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
import gql from 'graphql-tag'

export default {
  name: 'Jobs',
  data: () => ({
    search: null,
    headers: [
      { text: 'Title', align: 'start', value: 'title', width: '200px' },
      { text: 'Description', align: 'start', value: 'description' },
      {
        text: '',
        align: 'start',
        sortable: false,
        value: 'action',
        width: '100px',
      },
    ],
    tableParams: {
      model: 'jobs',
      query: gql`
        {
          _id
          title
          description
        }
      `,
    },
    jobs: [],
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
          const result = await this.deleteMutation('Job', items._id)

          if (result) {
            // eslint-disable-next-line no-undef
            swal({
              title: 'Success',
              icon: 'success',
              text: 'Job(s) has been successfully deleted',
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
  },
}
</script>
