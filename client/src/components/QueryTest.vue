<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1></h1>
      </v-flex>

      <v-flex xs12 class="text-xs-center" mt-1>
        <v-layout row ma-2 justify-center>
          <v-flex xs4 md1 order-md1 order-xs1>
            <v-menu
              :close-on-content-click="false"
              v-model="menu1"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="computedDateFormatted"
                label="시작날짜"
                persistent-hint
                prepend-icon="event"
                readonly
                :error-messages="errors.collect('startDate')"
                required=""
                v-validate="'required'" 
                data-vv-name="startDate"
              ></v-text-field>
              <v-date-picker v-model="sDate" no-title @input="menu1 = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs4 md1 order-md2 order-xs2>
            <v-menu
              :close-on-content-click="false"
              v-model="menu2"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="computedDateFormatted2"
                label="종료날짜"
                persistent-hint
                prepend-icon="event"
                readonly
                :error-messages="errors.collect('endDate')"
                required=""
                v-validate="'required'" 
                data-vv-name="endDate"
              ></v-text-field>
              <v-date-picker v-model="eDate" no-title @input="menu2 = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs4 md1 order-md3 order-xs3>
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="light-blue"
              class="white--text"
              @click.native="searchJournals"
            >
              검색
            </v-btn>
          </v-flex>     
        </v-layout>
      </v-flex>

      <v-flex xs12 class="text-xs-center" mt-1>
        <v-layout row ma-2 justify-center>
          <v-flex xs8 md2 order-md1 order-xs1>
            <v-radio-group v-model="radioRow" row>
              <v-radio label="WCDATAS" value="radio-1" @change='radioChanged' checked></v-radio>
              <v-radio label="SENSORDATAS" value="radio-2" @change='radioChanged'></v-radio>
            </v-radio-group>
          </v-flex>
        </v-layout>
      </v-flex>

      <!-- <div id="wcdatasDiv" style="display:block"> -->
        <v-flex v-if="selectedRadio === 'radio-1'" xs12 class="text-xs-center" mt-1>
          <v-toolbar-title>WCDATAS({{wcdatasCount}}개) - {{wcdatasTime}}ms</v-toolbar-title>
          <v-data-table
            :headers="wcHeaders"
            :items="wcdatas"
            hide-actions
            class="elevation-1"
          >
           
            <template slot="items" slot-scope="props">
              <td>{{ props.item._id }}</td>
              <td class="text-xs-left">{{ props.item.baseDate }}</td>
              <td class="text-xs-left">{{ props.item.baseTime }}</td>
              <td class="text-xs-left">{{ props.item.pty }}</td>
              <td class="text-xs-left">{{ props.item.reh }}</td>
              <td class="text-xs-left">{{ props.item.rn1 }}</td>
              <td class="text-xs-left">{{ props.item.sky }}</td>
              <td class="text-xs-left">{{ props.item.t1h }}</td>
              <td class="text-xs-left">{{ props.item.time }}</td>
            </template>
          </v-data-table>
        </v-flex>
      <!-- </div> -->

      <!-- dummy -->
      <div style="height: 50px; width: 100%;" />

      <!-- <div id="sensordatasDiv" style="display:none"> -->
        <v-flex v-if="selectedRadio === 'radio-2'" xs12 class="text-xs-center" mt-1>
          <v-toolbar-title>SENSORDATAS({{ssdatasCount}}개) - {{ssdatasTime}}ms</v-toolbar-title>
          <v-data-table
            :headers="ssHeaders"
            :items="ssdatas"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item._id }}</td>
              <td class="text-xs-left">{{ props.item.date }}</td>
              <td class="text-xs-left">{{ props.item.temperature }}</td>
              <td class="text-xs-left">{{ props.item.humidity }}</td>
              <td class="text-xs-left">{{ props.item.co2 }}</td>
            </template>
          </v-data-table>
        </v-flex>
      <!-- </div> -->

      <!-- dummy -->
      <div style="height: 50px; width: 100%;" />
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import SsService from '@/services/SsService'
import WcDataService from '@/services/WcDataService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      wcdatasCount: '',
      ssdatasCount: '',
      wcdatasTime: '',
      ssdatasTime: '',
      queryStartTime: '',
      queryEndTime: '',
      queryRunTime: '',
      ssHeaders: [
        {
          text: '_id',
          align: 'left',
          sortable: false,
          value: '_id'
        },
        { text: '날짜', value: 'date' },
        { text: '온도', value: 'temperature' },
        { text: '습도', value: 'humidity' },
        { text: '이산화탄소', value: 'co2' }
      ],
      ssdatas: [],
      wcHeaders: [
        {
          text: '_id',
          align: 'left',
          sortable: false,
          value: '_id'
        },
        { text: 'baseDate', value: 'baseDate' },
        { text: 'baseTime', value: 'baseTime' },
        { text: 'pty', value: 'pty' },
        { text: 'reh', value: 'reh' },
        { text: 'rn1', value: 'rn1' },
        { text: 'sky', value: 'sky' },
        { text: 't1h', value: 't1h' },
        { text: 'time', value: 'time' }
      ],
      wcdatas: [],
      userId: '',
      valid: true,
      name: '',
      nameRules: [
        v => !!v || '수확량 입력필요',
        v => (v && v.length <= 10) || '수확량은 10자 이하여야 합니다'
      ],
      startDate: null,
      endDate: null,
      sDate: null,
      eDate: null,
      menu1: false,
      menu2: false,
      loader: null,
      loading: false,
      weatherData: null,
      sensorData: null,
      dictionary: {
        custom: {
          startDate: {
            required: '시작날짜를 입력해주세요'
          },
          endDate: {
            required: '종료날짜를 입력해주세요'
          }
        }
      },
      radioRow: 'radio-1',
      selectedRadio: 'radio-1'
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
  },
  beforeCreate: function () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    } else {
    }
  },
  created: function () {
    this.userId = this.$session.get('userId')
    this.sDate = moment().format('YYYY-MM-DD')
    // this.startDate = '2018-08-27'
    this.eDate = moment().format('YYYY-MM-DD')
    // this.getWcDataAgg()
    // this.getSsDataAgg()
  },
  computed: {
    computedDateFormatted () {
      console.log(this.sDate)
      return this.sDate
    },
    computedDateFormatted2 () {
      console.log(this.eDate)
      return this.eDate
    }
  },
  watch: {
    /*
    loader () {
      const l = this.loader
      this[l] = !this[l]
      setTimeout(() => (this[l] = false), 1000)
      this.loader = null
    }
    */
  },
  methods: {
    searchJournals () {
      // this.loader = 'loading'
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        if (this.selectedRadio === 'radio-1') {
          this.getWcDataAgg()
        } else {
          this.getSsDataAgg()
        }
      }).catch(() => {})
    },
    checkTime: function () {
      return moment()
    },
    getWcDataAgg: function () {
      this.wcdatas = []
      this.getWeatherCrawlerDataAgg()
    },
    async getWeatherCrawlerDataAgg () {
      this.queryStartTime = moment()
      console.log(this.queryStartTime)

      const response = await WcDataService.fetchAllDataOfWcDataAgg({
        startDate: this.sDate.replace(/-/gi, ''),
        endDate: this.eDate.replace(/-/gi, '')
      })

      // console.log(response.data)
      this.wcdatas = response.data
      for (var i = 0; i < response.data.length; i++) {
        this.wcdatas[i].time = this.checkTime()
      }
      this.wcdatasCount = response.data.length

      this.queryEndTime = moment()
      console.log(this.queryEndTime)

      var queryRunTime = this.queryEndTime - this.queryStartTime
      console.log('wcdatas runTime : ' + queryRunTime)
      this.wcdatasTime = queryRunTime
    },
    getSsDataAgg: function () {
      this.ssdatas = []
      this.getSensorDataAgg()
    },
    async getSensorDataAgg () {
      this.queryStartTime = moment()
      console.log(this.queryStartTime)

      const response = await SsService.fetchAllDataOfSensorDataAgg({
        startDate: this.sDate.replace(/-/gi, ''),
        endDate: this.eDate.replace(/-/gi, '')
      })

      // console.log(response.data)
      this.ssdatas = response.data
      this.ssdatasCount = response.data.length

      /*
      this.queryEndTime = moment()
      console.log(this.queryEndTime)

      var queryRunTime = this.queryEndTime - this.queryStartTime
      console.log('ssdatas runTime : ' + queryRunTime)
      this.ssdatasTime = queryRunTime
      */
    },
    radioChanged: function (event) {
      // console.log(event)
      this.selectedRadio = event
      // this.getWeatherCrawlerDataAgg()
      // this.getSensorDataAgg()
    }
  }
}
</script>
