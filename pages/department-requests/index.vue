<template>
  <v-card>
    <v-card-title>
      <v-row dense>
        <v-col cols="5">
          <h3 class="mr-2">
            <v-icon left>mdi-phone-message-outline</v-icon> Department Requests
          </h3>
        </v-col>
        <v-col cols="12">
          <v-divider class="my-2" />
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
            <v-icon left>mdi-close</v-icon>Delete Selected
          </v-btn>
          <v-spacer v-else />
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
        :items="departmentRequests"
        item-key="_id"
        loading-text="Loading please wait..."
        :loading="loading"
        :options.sync="tableParams.options"
        :server-items-length="departmentRequests.length"
        @input="afterSelectedEventsOnTableList"
      >
        <template slot="item.service" slot-scope="row">
          {{ row.item.service.name }}
        </template>
        <template slot="item.customer" slot-scope="row">
          <article v-if="row.item.customer" class="mt-3">
            <h3 v-if="row.item.customer.fullName">
              {{ row.item.customer.fullName }}<br />
            </h3>
            <p>
              <span v-if="row.item.customer.email">
                <v-icon left small>mdi-email</v-icon>
                {{ row.item.customer.email }}<br />
              </span>
              <span v-if="row.item.customer.phoneNumber">
                <v-icon left small>mdi-phone</v-icon>
                {{ row.item.customer.phoneNumber }}<br />
              </span>
              <span v-if="row.item.customer.mobileNumber">
                <v-icon left small>mdi-cellphone</v-icon>
                {{ row.item.customer.mobileNumber }}<br />
              </span>
            </p>
          </article>
        </template>
        <template slot="item.lastActionTaken" slot-scope="row">
          <p>{{ row.item.lastActionTaken }}</p>
        </template>
        <template slot="item.action" slot-scope="row">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                v-bind="attrs"
                color="primary"
                class="mr-2"
                icon
                v-on="on"
                @click.prevent="$refs.contactCustomerModal.show(row.item._id)"
              >
                <v-icon>mdi-email-outline</v-icon>
              </v-btn>
            </template>
            <span>Email Customer</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                v-bind="attrs"
                color="primary"
                class="mr-2"
                icon
                v-on="on"
                @click.prevent="$refs.contactCustomerModal.show(row.item._id)"
              >
                <v-icon>mdi-phone</v-icon>
              </v-btn>
            </template>
            <span>Call Customer</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn small v-bind="attrs" v-on="on" color="success" icon>
                <v-icon>mdi-briefcase-outline</v-icon>
              </v-btn>
            </template>
            <span>Create job listing for this request</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>

    <!-- <contact-customer-modal ref="contactCustomerModal" /> -->
  </v-card>
</template>
<script>
export default {
  name: 'DepartmentRequests',
  components: {
    // ContactCustomerModal
  },
  // eslint-disable-next-line no-undef
  mixins: [TableMixin],
  data: () => ({
    search: null,
    headers: [
      {
        text: 'Service Subscription',
        align: 'start',
        value: 'service',
        width: '200px',
      },
      { text: 'Order #', align: 'start', value: 'orderNumber' },
      { text: 'Customer', align: 'start', value: 'customer' },
      { text: 'Last action taken', align: 'start', value: 'lastActionTaken' },
      { text: 'Actions', align: 'start', sortable: false, value: 'action' },
    ],
    departmentRequests: [
      {
        _id: 'dept-req-1001',
        lastActionTaken: 'contacted via phone',
        orderNumber: 'ORD-0001',
        customer: {
          _id: 'cust-1001',
          fullName: 'Louise S. Franco',
          phoneNumber: '530-753-6027',
          mobileNumber: '+1111111',
          email: 'johndoe@gmail.com',
        },
        service: { _id: 'srv-1001', name: 'Web Development' },
      },
      {
        _id: 'dept-req-1002',
        lastActionTaken: 'contacted via mobile',
        orderNumber: 'ORD-0002',
        customer: {
          _id: 'cust-1001',
          fullName: 'Gilbert Fillion',
          phoneNumber: '780.537.7671',
          mobileNumber: '+1111111',
          email: 'gilbon@gmail.com',
        },
        service: { _id: 'srv-1001', name: 'Content Writing' },
      },
      {
        _id: 'dept-req-1003',
        lastActionTaken: 'emailed',
        orderNumber: 'ORD-0003',
        customer: {
          _id: 'cust-1001',
          fullName: 'Suzanne Carrier',
          phoneNumber: '+1-443-251-0729',
          mobileNumber: '+1111111',
          email: 'suzannier@gmail.com',
        },
        service: { _id: 'srv-1001', name: 'SEO' },
      },
      {
        _id: 'dept-req-1004',
        lastActionTaken: 'job created',
        orderNumber: 'ORD-0004',
        customer: {
          _id: 'cust-1001',
          fullName: 'David Simard-Ouellet',
          phoneNumber: '714-693-6200',
          mobileNumber: '+1111111',
          email: 'davidlet@gmail.com',
        },
        service: { _id: 'srv-1001', name: 'Accounts' },
      },
      {
        _id: 'dept-req-1005',
        lastActionTaken: 'no action',
        orderNumber: 'ORD-0005',
        customer: {
          _id: 'cust-1001',
          fullName: 'Pauline Blanchette',
          phoneNumber: '787-304-2591',
          mobileNumber: '+1111111',
          email: 'paultte@gmail.com',
        },
        service: { _id: 'srv-1001', name: 'Web Design' },
      },
    ],
  }),
  methods: {
    afterSelectedEventsOnTableList(items) {
      this.tableItems.selected = items
    },
  },
  mounted() {
    // this.getItems()
  },
  beforeDestroy() {
    // this.clearGetItems()
  },
}
</script>
