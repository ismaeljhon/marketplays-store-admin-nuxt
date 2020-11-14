<template>
  <div class="text-center">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
    <span class="ml-3" v-text="loadingText"></span>
  </div>
</template>
<script>
export default {
  name: 'LoadingComponent',
  props: {
    loadingText: {
      type: String,
      default: 'Loading...',
    },
  },
}
</script>
