<template>
<!-- https://github.com/okchangwon/vue-daum-map -->
<v-dialog v-model="dialog" max-width="600px" max-height="600px">
  <div>
    <v-btn      
      color="red"
      class="white--text"
      @click.native='downloadExcelFile'>
      Excel 다운로드
    </v-btn>
  <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>    
  </div>
</v-dialog>
</template>

<script>
import {bus} from '../main'
// import ParkingService from '@/services/ParkingService'
// https://rowanwins.github.io/vue-dropzone/docs/dist/#/installation
// https://www.dropzonejs.com/#configuration-options
// https://alligator.io/vuejs/vue-dropzone/
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import XLSX from 'xlsx'
export default {
  components: {
    vueDropzone: vue2Dropzone
  },
  data () {
    return {
      dialog: false,
      dropzoneOptions: {
        url: 'http://192.168.0.73:9081/excel/upload',
        maxFilesize: 2, // MB
        maxFiles: 1,
        thumbnailWidth: 150,
        headers: { 'My-Awesome-Header': 'header value' },
        addRemoveLinks: true,
        paramName: 'excel'
      },
      parkingData: []
    }
  },
  mounted () {
    var vm = this
    bus.$on('dialogForExcel', function (value) {
      vm.dialog = true
      vm.parkingData = value
      // console.log(value)
    })
  },
  created () {
  },
  methods: {
    getExcelFile () {
      for (var i = 0; i < this.parkingData.length; i++) {
        this.parkingData[i].w_op_start_time = this.parkingData[i].w_op.start_time
        this.parkingData[i].w_op_end_time = this.parkingData[i].w_op.end_time
        delete this.parkingData[i].w_op

        this.parkingData[i].s_op_start_time = this.parkingData[i].s_op.start_time
        this.parkingData[i].s_op_end_time = this.parkingData[i].s_op.end_time
        delete this.parkingData[i].s_op

        this.parkingData[i].h_op_start_time = this.parkingData[i].h_op.start_time
        this.parkingData[i].h_op_end_time = this.parkingData[i].h_op.end_time
        delete this.parkingData[i].h_op

        this.parkingData[i].park_base_time = this.parkingData[i].park_base.time
        this.parkingData[i].park_base_fee = this.parkingData[i].park_base.fee
        delete this.parkingData[i].park_base

        this.parkingData[i].add_term_time = this.parkingData[i].add_term.time
        this.parkingData[i].add_term_fee = this.parkingData[i].add_term.fee
        delete this.parkingData[i].add_term

        this.parkingData[i].one_day_park_time = this.parkingData[i].one_day_park.time
        this.parkingData[i].one_day_park_fee = this.parkingData[i].one_day_park.fee
        delete this.parkingData[i].one_day_park

        this.parkingData[i].park_space_count_small = this.parkingData[i].park_space_count.small
        this.parkingData[i].park_space_count_mid = this.parkingData[i].park_space_count.mid
        this.parkingData[i].park_space_count_big = this.parkingData[i].park_space_count.big
        this.parkingData[i].park_space_count_elec = this.parkingData[i].park_space_count.elec
        this.parkingData[i].park_space_count_hand = this.parkingData[i].park_space_count.hand
        delete this.parkingData[i].park_space_count
      }
      // https://lovemewithoutall.github.io/it/json-to-excel/
      var parkingWS = XLSX.utils.json_to_sheet(this.parkingData)
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, parkingWS, 'parkingData') // sheetAName is name of Worksheet
      XLSX.writeFile(wb, 'parkingData.xlsx')
    },
    downloadExcelFile () {
      this.getExcelFile()
    }
  }
}
</script>