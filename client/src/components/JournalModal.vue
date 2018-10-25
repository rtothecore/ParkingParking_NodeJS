<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card color="teal">
        <v-card-title>
          <span class="headline" style="color:white">{{User_Profile}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs6 sm6 md3>
                <v-select
                  v-validate="'required'"
                  :items="landItems"
                  v-model="selectLand"
                  :error-messages="errors.collect('selectLand')"
                  label="농장명"
                  data-vv-name="selectLand"
                  required
                  v-on:change="onChangeLand"
                  item-text="name"
                  item-value="_id"
                  solo
                ></v-select>
              </v-flex>
              <v-flex xs6 sm6 md3>
                <v-text-field
                  v-model="cropName"
                  label="작물명" 
                  hint="농장명을 선택하면 자동입력됩니다"
                  persistent-hint
                  required
                  solo
                  ></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md3>
                <v-select
                  v-validate="'required'"
                  :items="workType"
                  v-model="selectWorkType"
                  :error-messages="errors.collect('selectWorkType')"
                  label="작업분류"
                  data-vv-name="selectWorkType"
                  required
                  v-on:change="onChangeWorkType"
                  hint="작물명에 따른 작업분류 선택"
                  persistent-hint
                  solo                  
                ></v-select>
              </v-flex>
              <v-flex xs6 sm6 md3>
                <v-btn outline color="white" @click.native="addWorkType">작업추가</v-btn>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="workContent" label="작업내용" solo></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <!-- <v-text-field label="작업시간" type="password" required></v-text-field> -->
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu2"
                  transition="scale-transition"
                  offset-y
                  :nudge-left="40"
                >
                  <v-text-field
                    v-validate="'required'"
                    v-model="e6"
                    :error-messages="errors.collect('e6')"
                    label="작업시작 시간"
                    data-vv-name="e6"
                    required
                    slot="activator"
                    prepend-icon="access_time"
                    readonly
                    v-on:change="onChangeWSTime"
                    solo
                  ></v-text-field>
                  <v-time-picker v-model="e6" format="24hr" autosave></v-time-picker>
                </v-menu>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <!-- <v-text-field label="작업시간" type="password" required></v-text-field> -->
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu3"
                  transition="scale-transition"
                  offset-y
                  :nudge-left="40"
                >
                  <v-text-field
                    v-validate="'required'"
                    v-model="e7"
                    :error-messages="errors.collect('e7')"
                    label="작업종료 시간"
                    data-vv-name="e7"
                    required
                    slot="activator"
                    prepend-icon="access_time"
                    readonly
                    v-on:change="onChangeWETime"
                    solo
                  ></v-text-field>
                  <v-time-picker v-model="e7" format="24hr" autosave></v-time-picker>
                </v-menu>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field 
                  label="날씨" 
                  hint="자동입력"
                  persistent-hint
                  readonly
                  solo
                  ></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field 
                  label="온도" 
                  hint="자동입력"
                  persistent-hint
                  readonly
                  solo
                  ></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field 
                  label="습도" 
                  hint="자동입력"
                  persistent-hint
                  readonly
                  solo
                  ></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field 
                  label="강수량" 
                  hint="자동입력"
                  persistent-hint
                  readonly
                  solo
                  ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="remarks" label="특기사항" solo></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*필수 입력 사항입니다</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outline color="white" flat @click.native="dialog = false">취소</v-btn>
          <!-- <v-btn color="blue darken-1" flat @click.native="dialog = false" :disabled="!valid">작성</v-btn> -->
          <v-btn outline color="white" flat @click.native="save">작성</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {bus} from '../main'
import LandService from '@/services/LandService'
import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
import JournalService from '@/services/JournalService'
import WeatherService from '@/services/WeatherService'
var async = require('async')  // https://caolan.github.io/async/
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      weatherData: [],
      convertedXY: {},
      newEvent: {},
      journalId: '',
      remarks: '',
      workContent: '',
      selectedWSTime: '',
      selectedWETime: '',
      selectedWorkTypeCode: '',
      selectedLandId: '',
      selectedCropCode: '',
      dialog: false,
      User_Profile: '',
      menu2: false,
      menu3: false,
      e6: null,
      e7: null,
      landItems: [],
      userId: '5af4fa281a1ee4261039149f',
      cropName: '',
      workType: [],
      selectLand: null,
      selectWorkType: null,
      dictionary: {
        custom: {
          e7: {
            required: '작업종료 시간을 입력해주세요'
          },
          e6: {
            required: '작업시작 시간을 입력해주세요'
          },
          selectLand: {
            required: '농장명을 선택해주세요'
          },
          selectWorkType: {
            required: '작업분류를 선택해주세요'
          }
        }
      }
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
    var vm = this
    bus.$on('dialog', function (value) {
      Object.assign(vm.$data, vm.$options.data.call(vm))  // initialize this data
      vm.User_Profile = '영농일지 작성 - ' + value
      vm.selectLand = ''
      vm.cropName = ''
      vm.selectWorkType = ''
      vm.workContent = ''
      vm.e6 = null
      vm.e7 = null
      vm.remarks = ''
      vm.dialog = true
      vm.getLocation()
      vm.getLands()
    })
  },
  created () {
    this.getLocation()
    this.getLands()
  },
  methods: {
    async getLands () {
      const response = await LandService.fetchLands({
        userId: this.userId
      })
      this.landItems = response.data.lands
    },
    async getCropCodeByLandId (landId) {
      const response = await LandService.fetchCropCodeByLandId({
        landId: landId
      })
      this.selectedCropCode = response.data[0].cropCode
      this.getCropNameByCropCode(this.selectedCropCode)
      this.getWorkTypeByCropCode(this.selectedCropCode)
    },
    async getCropNameByCropCode (cropCode) {
      const response = await ScService.fetchCropNameByCropCode({
        cropCode: cropCode
      })
      this.cropName = response.data[0].text
    },
    async getWorkTypeByCropCode (cropCode) {
      const response = await WcService.fetchTextByCropCode({
        cropCode: cropCode
      })
      this.workType = response.data
    },
    async createNewJournal () {
      async.series([this.task1, this.task2], function (err, results) {
        if (err) {
          console.log('error : ' + err)
        } else {
          console.log('task finish')
          console.log(results)
        }
      })
    },
    async fetchNameByLandId (landId) {
      const response = await LandService.fetchNameByLandId({
        landId: landId
      })
      this.newEvent.title = response.data[0].name
    },
    async fetchCropNameByCropCode (cropCode) {
      const response = await ScService.fetchCropNameByCropCode({
        cropCode: cropCode
      })
      this.newEvent.title += ' - ' + response.data[0].text
    },
    async fetchTextByCode (workCode) {
      const response = await WcService.fetchTextByCode({
        code: workCode
      })
      this.newEvent.title += '\n' + response.data[0].text + ' - ' + this.workContent
    },
    async fetchWeatherData (baseDate, baseTime, callback, weatherDataSize) {
      const response = await WeatherService.fetchWeatherData({
        baseDate: baseDate,
        baseTime: baseTime,
        nx: this.convertedXY.x,
        ny: this.convertedXY.y
      })
      var tmpObj = {}
      tmpObj.baseTime = baseTime
      var normalCode = '0000'
      var abnormalCode = '99'
      if (normalCode === await response.data.response.header.resultCode) {
        var sky = 'SKY'
        var t1h = 'T1H'
        var reh = 'REH'
        var rn1 = 'RN1'
        for (var i = 0; i < await response.data.response.body.items.item.length; i++) {
          if (sky === await response.data.response.body.items.item[i].category) {
            tmpObj.sky = await response.data.response.body.items.item[i].obsrValue + ''
          } else if (t1h === await response.data.response.body.items.item[i].category) {
            tmpObj.t1h = await response.data.response.body.items.item[i].obsrValue + ''
          } else if (reh === await response.data.response.body.items.item[i].category) {
            tmpObj.reh = await response.data.response.body.items.item[i].obsrValue + ''
          } else if (rn1 === await response.data.response.body.items.item[i].category) {
            tmpObj.rn1 = await response.data.response.body.items.item[i].obsrValue + ''
          }
        }
      } else if (abnormalCode === await response.data.response.header.resultCode) {
        tmpObj.sky = '-1'
        tmpObj.t1h = '-1'
        tmpObj.reh = '-1'
        tmpObj.rn1 = '-1'
      }
      this.weatherData.push(tmpObj)
      if (this.weatherData.length === weatherDataSize) {
        callback(null, 'result1')
      }
    },
    task1: function (callback) {
      this.getWeatherData(this.User_Profile.substring(10, 20).replace(/-/gi, ''),
                          this.selectedWSTime.substring(0, 2).replace(/(^0+)/, ''),
                          this.selectedWETime.substring(0, 2).replace(/(^0+)/, ''),
                          callback)
    },
    task2: function (callback) {
      this.task21()
      // callback(null, 'result2')
    },
    async task21 () {
      const response = await JournalService.createJournals({
        userId: this.userId,
        date: this.User_Profile.substring(10, 20),
        landId: this.selectedLandId,
        workCode: this.selectedWorkTypeCode,
        workContent: this.workContent,
        workSTime: this.selectedWSTime,
        workETime: this.selectedWETime,
        // weather: [{'baseTime': '1400', 'sky': '00', 't1h': '17', 'reh': '01', 'rn1': '02'}],
        weather: this.weatherData,
        remarks: this.remarks
      })
      this.newEvent.journalId = response.data.result._id
      this.fetchNameByLandId(this.selectedLandId)
      this.fetchCropNameByCropCode(this.selectedWorkTypeCode.substring(0, 11))
      this.fetchTextByCode(this.selectedWorkTypeCode)
    },
    getWeatherData: function (baseDate, baseSTime, baseETime, callback) {
      // console.log('baseDate:' + baseDate + ', baseSTime:' + baseSTime + ', baseETime:' + baseETime)
      for (var i = baseSTime * 1; i < baseETime * 1; i++) {
        var baseTime = this.leadingZeros(i, 2) + '00'
        var weatherDataSize = baseETime - baseSTime
        this.fetchWeatherData(baseDate, baseTime, callback, weatherDataSize)
      }
    },
    leadingZeros: function (n, digits) {
      var zero = ''
      n = n.toString()

      if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++) {
          zero += '0'
        }
      }
      return zero + n
    },
    getLocation: function () {
      this.getLandsByUserId()
    },
    async getLandsByUserId () {
      var vm = this
      const response = await LandService.fetchLands({
        userId: this.userId
      })
      // Do geo coding
      // https://github.com/googlemaps/google-maps-services-js
      var googleMapsClient = require('@google/maps').createClient({
        key: 'AIzaSyAbcu_ORn9DV9mv0GFbxwX3FrYFMyL-nRA'
      })
      googleMapsClient.geocode({
        address: response.data.lands[0].address
      }, function (err, response) {
        if (!err) {
          vm.convertedXY = vm.dfs_xy_conv('toXY', response.json.results[0].geometry.location.lat, response.json.results[0].geometry.location.lng)
        }
      })
    },
    /* OLD VERSION WITH "navigator.geolocation"
    getLocation: function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    },
    showPosition: function (position) {
      this.convertedXY = this.dfs_xy_conv('toXY', position.coords.latitude, position.coords.longitude)
    },
    */
    dfs_xy_conv: function (code, v1, v2) { // http://fronteer.kr/service/kmaxy - 37.579871128849334, 126.98935225645432 => 60, 127
      var RE = 6371.00877 // 지구 반경(km)
      var GRID = 5.0 // 격자 간격(km)
      var SLAT1 = 30.0 // 투영 위도1(degree)
      var SLAT2 = 60.0 // 투영 위도2(degree)
      var OLON = 126.0 // 기준점 경도(degree)
      var OLAT = 38.0 // 기준점 위도(degree)
      var XO = 43 // 기준점 X좌표(GRID)
      var YO = 136 // 기1준점 Y좌표(GRID)

      var DEGRAD = Math.PI / 180.0
      var RADDEG = 180.0 / Math.PI

      var re = RE / GRID
      var slat1 = SLAT1 * DEGRAD
      var slat2 = SLAT2 * DEGRAD
      var olon = OLON * DEGRAD
      var olat = OLAT * DEGRAD

      var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5)
      sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn)
      var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5)
      sf = Math.pow(sf, sn) * Math.cos(slat1) / sn
      var ro = Math.tan(Math.PI * 0.25 + olat * 0.5)
      ro = re * sf / Math.pow(ro, sn)
      var rs = {}
      if (code === 'toXY') {
        rs['lat'] = v1
        rs['lng'] = v2
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5)
        ra = re * sf / Math.pow(ra, sn)
        var theta = v2 * DEGRAD - olon
        if (theta > Math.PI) theta -= 2.0 * Math.PI
        if (theta < -Math.PI) theta += 2.0 * Math.PI
        theta *= sn
        rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5)
        rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)
      } else {
        rs['x'] = v1
        rs['y'] = v2
        var xn = v1 - XO
        var yn = ro - v2 + YO
        ra = Math.sqrt(xn * xn + yn * yn)
        if (sn < 0.0) {
          ra = -ra
        }
        var alat = Math.pow((re * sf / ra), (1.0 / sn))
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5

        if (Math.abs(xn) <= 0.0) {
          theta = 0.0
        } else {
          if (Math.abs(yn) <= 0.0) {
            theta = Math.PI * 0.5
            if (xn < 0.0) {
              theta = -theta
            }
          } else theta = Math.atan2(xn, yn)
        }
        var alon = theta / sn + olon
        rs['lat'] = alat * RADDEG
        rs['lng'] = alon * RADDEG
      }
      return rs
    },
    onChangeLand: function (event) {
      this.selectedLandId = event
      this.getCropCodeByLandId(this.selectedLandId)
    },
    onChangeWorkType: function (event) {
      this.selectedWorkTypeCode = event.bCode + event.mCode + event.sCode + event.wCode
    },
    onChangeWSTime: function (event) {
      this.newEvent.start = this.User_Profile.substring(10, 20) + ' ' + event
      var tmpStr = event
      this.selectedWSTime = tmpStr.replace(':', '')
      console.log(this.selectedWSTime)
    },
    onChangeWETime: function (event) {
      this.newEvent.end = this.User_Profile.substring(10, 20) + ' ' + event
      var tmpStr = event
      this.selectedWETime = tmpStr.replace(':', '')
      console.log(this.selectedWETime)
    },
    save () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.createNewJournal()
        this.$swal({
          type: 'success',
          title: '일지를 작성하였습니다',
          showConfirmButton: false,
          timer: 777
        }).then((result) => {
          bus.$emit('toJournalForNew', this.newEvent)
          this.dialog = false
        })
        // bus.$emit('toJournal', 'test')
        // this.dialog = false
      }).catch(() => {})
    },
    addWorkType () {
      bus.$emit('dialogForAddWorkType', 'test')
    }
  }
}
</script>