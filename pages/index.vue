<template>
  <Table :tableData="tableData" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',

  data() {
    return {
      tableData: {
        headings: ['artist', 'name', 'album', 'duration'],
        list: [
          {
            artist: 'nirvana',
            name: 'Smells Like Teen Spirit',
            album: 'nevermind',
            duration: '5:01',
          },
          {
            artist: 'nirvana',
            name: 'Rape Me',
            album: 'In Utero',
            duration: '2:50',
          },
          {
            artist: 'nirvana',
            name: 'Polly',
            album: 'nevermind',
            duration: '2:53',
          },
          {
            artist: 'skillet',
            name: 'hero',
            album: 'Awake',
            duration: '3:06',
          },
          {
            artist: 'skillet',
            name: 'Monster',
            album: 'Awake',
            duration: '2:58',
          },
          {
            artist: 'skillet',
            name: 'Feel Invincible',
            album: 'unleashed',
            duration: '3:50',
          },
          {
            artist: 'ac/dc',
            name: 'Back In Black',
            album: 'Back In Black',
            duration: '4:16',
          },
        ],
      },
    }
  },
  computed: {},
  mounted() {},
})
</script>
