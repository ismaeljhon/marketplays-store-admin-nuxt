<template>
  <v-alert prominent text type="warning">
    {{ message }}
  </v-alert>
</template>
<script>
export default {
  name: 'NoDataMessage',
  props: {
    message: {
      type: String,
      default: 'No Data Available',
    },
  },
}
</script>
