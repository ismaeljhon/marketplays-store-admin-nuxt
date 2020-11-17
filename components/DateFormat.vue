<template>
  <span>{{ date | moment('MM/DD/YYYY hh:mma') }}</span>
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
