<template>
  <span>{{ lastname }}, {{ firstname }} {{ middlename }}</span>
</template>
<script>
export default {
  name: 'NameFormat',
  props: {
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    middlename: {
      type: String
    },
  }
}
</script>