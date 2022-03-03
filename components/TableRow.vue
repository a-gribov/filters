<template>
  <div class="row">
    <div class="col">{{ artist }}</div>
    <div class="col">{{ name }}</div>
    <div class="col">{{ album }}</div>
    <div class="col">{{ duration }}</div>
  </div>
</template>

<script>
export default {
  name: 'TableRow',
  props: {
    artist: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    album: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
  },
}
</script>
<style lang="scss" scoped>
.row {
  display: flex;
  margin-top: 1.5rem;
  justify-content: space-between;
}
.col {
  width: 20%;
}
</style>
