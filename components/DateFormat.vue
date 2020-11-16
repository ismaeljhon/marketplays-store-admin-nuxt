<template>
  <span>{{ date | moment('D MMM YYYY hh:mm A') }}</span>
</template>
<script>
export default {
  name: 'DateFormat',
  props: {
    date: {
      type: String,
      required: true,
    },
  },
}
</script>
