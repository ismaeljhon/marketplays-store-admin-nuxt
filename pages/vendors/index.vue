<template>
  <v-card>
    <v-card-title>
      <v-row dense>
        <v-col cols="5">
          <h3 class="mr-2"><v-icon left>mdi-account-tie</v-icon> Vendors</h3>
        </v-col>
        <v-col cols="7" class="text-right">
          <download-csv
            class="mr-2 v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--tile theme--light v-size--small"
            :data="vendors"
            style="cursor: pointer"
          >
            <v-icon left>mdi-download</v-icon>Export Vendors
          </download-csv>
          <NuxtLink to="/vendors/add">
            <v-btn small color="primary">
              <v-icon left>mdi-plus</v-icon>Add Vendor
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
        :items="vendors"
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

        <template slot="item.emailVerified" slot-scope="row">
          <v-checkbox
            :disabled="row.item.emailVerified"
            :value="row.item.emailVerified"
            v-model="row.item.emailVerified"
            @click.prevent="approveVendor(row.item)"
          ></v-checkbox>
        </template>

        <template slot="item.action" slot-scope="row">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <NuxtLink :to="'/vendors/' + row.item._id">
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
  name: 'Vendors',
  data: () => ({
    search: null,
    headers: [
      { text: 'Name', align: 'start', value: 'name' },
      { text: 'Business Name', align: 'start', value: 'businessName' },
      { text: 'Phone Number', align: 'start', value: 'phoneNumber' },
      { text: 'Email', align: 'start', value: 'email' },
      // {
      //   text: 'Verification Code',
      //   align: 'start',
      //   sortable: false,
      //   value: 'verificationCode',
      // },
      {
        text: 'Is Verified?',
        align: 'end',
        sortable: false,
        value: 'emailVerified',
      },
      {
        text: 'Actions',
        align: 'start',
        sortable: false,
        value: 'action',
        width: '100px',
      },
    ],
    tableParams: {
      model: 'vendors',
      query: gql`
        {
          _id
          firstName
          middleName
          lastName
          email
          contactNumber
          businessName
          businessAddress
          phoneNumber
          dateTimeForVerification
          verificationCode
          emailVerified
        }
      `,
    },
    vendors: [],
  }),
  beforeDestroy() {
    this.clearGetItems()
  },
  mounted() {
    this.getItems()
  },
  methods: {
    async approveVendor(item) {
      const record = {
        code: item.verificationCode,
      }

      const result = await this.$apollo
        .mutate({
          mutation: gql`
            mutation verifyUser($record: UserVerifyEmailInput!) {
              verifyUser(record: $record) {
                record {
                  email
                  emailVerified
                }
              }
            }
          `,
          variables: {
            record,
          },
        })
        .then((response) => {
          console.log(response)
          // return response.data['update' + model + 'ById'].record
        })
        .catch(() => {
          swal({
            title: 'Error',
            icon: 'error',
            text: `Something went wrong while updating ${model.toLowerCase()}`,
          })
          return false
        })

      if (result) {
        // this.form = {}
        this.back()
        // eslint-disable-next-line no-undef
        swal({
          title: 'Success',
          icon: 'success',
          text: 'Vendor has been successfully approved',
        })
      }
    },
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
          const result = await this.deleteMutation('Vendor', items._id)

          if (result) {
            // eslint-disable-next-line no-undef
            swal({
              title: 'Success',
              icon: 'success',
              text: 'Vendor(s) has been successfully deleted',
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
