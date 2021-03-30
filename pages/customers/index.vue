<template>
  <v-card>
    <v-card-title>
      <v-row dense>
        <v-col cols="5">
          <h3 class="mr-2">
            <v-icon left>mdi-account-multiple</v-icon> Customers
          </h3>
        </v-col>
        <v-col cols="7" class="text-right">
          <download-csv
            class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small"
            :data="customers"
            style="cursor: pointer"
          >
            <v-icon left>mdi-download</v-icon>Export Customers
          </download-csv>
          <NuxtLink to="/customers/add">
            <v-btn small color="primary">
              <v-icon left>mdi-plus</v-icon>Add Customer
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
        :items="customers"
        item-key="_id"
        loading-text="Loading please wait..."
        :loading="isLoading"
        :options.sync="tableParams.options"
        :server-items-length="itemsCount"
        @input="afterSelectedEventsOnTableList"
      >
        <template slot="item.name" slot-scope="row">
          <name-format
            :firstname="row.item.firstName"
            :lastname="row.item.lastName"
            :middlename="row.item.middleName"
          />
        </template>
        <template slot="item.action" slot-scope="row">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <NuxtLink :to="'/customers/' + row.item._id">
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
  name: 'Customers',
  data: () => ({
    search: null,
    headers: [
      { text: 'Name', align: 'start', value: 'name' },
      { text: 'Email', align: 'start', value: 'email' },
      {
        text: '',
        align: 'start',
        sortable: false,
        value: 'action',
        width: '100px',
      },
    ],
    tableParams: {
      model: 'customers',
      query: gql`
        {
          _id
          firstName
          middleName
          lastName
          email
        }
      `,
    },
    customers: [],
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
          const result = await this.deleteMutation('Customer', items._id)

          if (result) {
            // eslint-disable-next-line no-undef
            swal({
              title: 'Success',
              icon: 'success',
              text: 'Customer(s) has been successfully deleted',
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
