<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>작업시간</h1>
      </v-flex>

      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

       <v-flex xs6 sm6 md2>
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
          <v-date-picker v-model="sDate" no-title @input="menu1 = false" locale='euc-kr'></v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs6 sm6 md2>
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
          <v-date-picker v-model="eDate" no-title @input="menu2 = false" locale='euc-kr'></v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs8 sm4 md2>
        <v-select
          :items="landItems"
          v-model="e2"

          :error-messages="errors.collect('e2')"
          v-validate="'required'"
          data-vv-name="e2"

          label="농장선택"
          class="input-group--focused"
          item-text="name"
          item-value="_id"
          v-on:change="onChangeLand"
        ></v-select>
      </v-flex>

      <v-flex xs4 sm8 md2 class="text-xs-left">
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
      
      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

      <div v-if="$mq === 'laptop' || $mq === 'desktop'" id="chartContainer" style="height: 360px; width: 70%;" />
      <!-- For Mobile -->
      <div v-else id="chartContainer" style="height: 260px; width: 100%;" />
      
    </v-layout>
  </v-container>
</template>

<script>
import LandService from '@/services/LandService'
import JournalService from '@/services/JournalService'
// https://canvasjs.com/forums/topic/can-canvasjs-work-with-webpack/
const CanvasJS = require('../../canvasjs.min.js')
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      userId: '',
      sDate: null,
      eDate: null,
      menu1: false,
      menu2: false,
      startDate: null,
      e2: null,
      endDate: null,
      landItems: [],
      selectedLandId: null,
      loader: null,
      loading: false,
      dictionary: {
        custom: {
          startDate: {
            required: '시작날짜를 입력해주세요'
          },
          endDate: {
            required: '종료날짜를 입력해주세요'
          },
          e2: {
            required: '농장을 선택해주세요'
          }
        }
      },
      chartOptions: {
        data: [
          {
            type: 'line',
            dataPoints: [
              /*
              { x: new Date('2018-01-01'), y: 12 },
              { x: new Date('2018-01-02'), y: 11 },
              { x: new Date('2018-01-03'), y: 8 },
              { x: new Date('2018-01-04'), y: 9 },
              { x: new Date('2018-01-05'), y: 9 },
              { x: new Date('2018-01-06'), y: 6 },
              { x: new Date('2018-01-07'), y: 8 },
              { x: new Date('2018-01-08'), y: 4 },
              { x: new Date('2018-01-09'), y: 9 }
              */
            ]
          }
        ],
        axisY: {
          title: '작업시간'
        }
      },
      chart: null
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)

    this.chart = new CanvasJS.Chart('chartContainer', this.chartOptions)
    this.chart.render()
  },
  beforeCreate: function () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    } else {
    }
  },
  created: function () {
    this.userId = this.$session.get('userId')
    this.getLands()
    this.showCharts()
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
    loader () {
      const l = this.loader
      this[l] = !this[l]
      setTimeout(() => (this[l] = false), 1000)
      this.loader = null
    }
  },
  methods: {
    async getJournalsWorktime () {
      var userId = this.userId
      if (!userId) {
        userId = 0
      }
      var startDate = this.sDate
      if (!startDate) {
        startDate = 0
      }
      var endDate = this.eDate
      if (!endDate) {
        endDate = 0
      }
      var landId = this.selectedLandId
      if (!landId) {
        landId = 0
      }
      const response = await JournalService.fetchJournalsWorktime({
        userId: userId,
        startDate: startDate,
        endDate: endDate,
        landId: landId
      })
      var tmpJournals = response.data
      var tmpWorkDatas = []
      this.chartOptions.data[0].dataPoints = []

      for (var i = 0; i < tmpJournals.length; i++) {
        var tmpWorkData = {}
        tmpWorkData.x = new Date(tmpJournals[i].date)

        var tmpWorkTime = tmpJournals[i].workETime - tmpJournals[i].workSTime
        var tmpStr = tmpWorkTime.toString()
        if (tmpStr.length === 3) {
          tmpWorkData.y = tmpStr.substring(0, 1) * 1
        } else if (tmpStr.length === 4) {
          tmpWorkData.y = tmpStr.substring(0, 2) * 1
        }
        tmpWorkDatas.push(tmpWorkData)
      }
      console.log(tmpWorkDatas)
      this.chartOptions.data[0].dataPoints = tmpWorkDatas
      this.chart.render()
    },
    async getLands () {
      const response = await LandService.fetchLands({
        userId: this.userId
      })
      this.landItems = response.data.lands
    },
    onChangeLand: function (event) {
      console.log(event)
      this.selectedLandId = event
    },
    searchJournals () {
      this.loader = 'loading'
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.getJournalsWorktime()
      }).catch(() => {})
    },
    showCharts () {
    },
    submit () {
      if (this.$refs.form.validate()) {
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  }
}
</script>
