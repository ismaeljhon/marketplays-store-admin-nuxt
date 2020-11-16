<template>
  <article v-if="customer" class="mt-3">
    <h3 v-if="customer.fullName || customer.name">
      {{ customer.fullName || customer.name }}<br />
    </h3>
    <p>
      <span v-if="customer.email">
        <v-icon left small>mdi-email</v-icon>
        {{ customer.email }}<br />
      </span>
      <span v-if="customer.phoneNumber">
        <v-icon left small>mdi-phone</v-icon>
        {{ customer.phoneNumber }}<br />
      </span>
      <span v-if="customer.mobileNumber">
        <v-icon left small>mdi-cellphone</v-icon>
        {{ customer.mobileNumber }}<br />
      </span>
      <span v-if="showFullAddress">
        <span v-if="customer.address">
          <v-icon left small>mdi-map-marker</v-icon>
          {{ customer.address }}
        </span>
      </span>
    </p>
  </article>
</template>
<script>
export default {
  name: 'CustomerDetails',
  props: {
    customer: {
      type: Object,
      default: null,
    },
    showFullAddress: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
