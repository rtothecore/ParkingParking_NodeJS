<template>
<!-- https://github.com/okchangwon/vue-daum-map -->
<v-dialog v-model="dialog" max-width="1024px" max-height="768px">
  <div>
    <img :src="selectedImage" alt="" width="100%">   
  </div>
</v-dialog>
</template>

<script>
import {bus} from '../main'

export default {
  data () {
    return {
      dialog: false,
      selectedImage: null
    }
  },
  mounted () {
    var vm = this
    bus.$on('dialogForImage', function (value) {
      vm.dialog = true
      vm.selectedImage = value
    })
  },
  created () {
  },
  methods: {
  }
}
</script>