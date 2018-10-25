<template>
<div style="position:absolute">
    <!-- <div id="calendar" style="height:900px; width:900px; float:left;"> -->
    <div id="calendar" v-bind:style="{ height: calendarHeight, width: calendarWidth, float: 'left'}">
      <div v-if="$mq === 'laptop' || $mq === 'desktop'">
        <v-layout row ma-2>
          <v-flex xs4 order-md1 order-xs1>
            <v-card color="white" class="black--text">
                <v-container fluid grid-list-lg>
                  <v-layout row>
                    <v-flex xs7>
                      <div>
                        <div class="subheading">오늘</div>
                        <div class="title">{{ todayT1h }}</div>
                        <div class="caption">{{ todayPm10 }}</div>
                      </div>
                    </v-flex>
                    <v-flex xs5>
                      <v-card-media
                        :src="todaySkyImg"
                        height="50px"
                        contain
                      ></v-card-media>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <div class="body-2">{{ weatherLoc }}</div>
                  </v-layout>

                </v-container>
              </v-card>
          </v-flex>
          <v-flex xs4 order-md2 order-xs2>
            <v-card color="white" class="black--text">
                <v-container fluid grid-list-lg>
                  <v-layout row>
                    <v-flex xs7>
                      <div>
                        <div class="subheading">내일 오전</div>
                        <div class="title">{{ tomorrowAmT1h }}</div>
                      </div>
                    </v-flex>
                    <v-flex xs5>
                      <v-card-media
                        :src="tomAmSkyImg"
                        height="100px"
                        contain
                      ></v-card-media>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
          </v-flex>

          <v-flex xs4 order-md2 order-xs2>
            <v-card color="white" class="black--text">
                <v-container fluid grid-list-lg>
                  <v-layout row>
                    <v-flex xs7>
                      <div>
                        <div class="subheading">내일 오후</div>
                        <div class="title">{{ tomorrowPmT1h }}</div>
                      </div>
                    </v-flex>
                    <v-flex xs5>
                      <v-card-media
                        :src="tomPmSkyImg"
                        height="100px"
                        contain
                      ></v-card-media>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
          </v-flex>

          <v-flex xs4 order-md3 order-xs3>
            <v-card color="white" class="black--text">
                <v-container fluid grid-list-lg>
                  <v-layout row>
                    <v-flex xs7>
                      <div>
                        <div class="subheading">모레 오전</div>
                        <div class="title">{{ afterTomorrowAmT1h }}</div>
                      </div>
                    </v-flex>
                    <v-flex xs5>
                      <v-card-media
                        :src="afTomAmSkyImg"
                        height="100px"
                        contain
                      ></v-card-media>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
          </v-flex>

          <v-flex xs4 order-md3 order-xs3>
            <v-card color="white" class="black--text">
                <v-container fluid grid-list-lg>
                  <v-layout row>
                    <v-flex xs7>
                      <div>
                        <div class="subheading">모레 오후</div>
                        <div class="title">{{ afterTomorrowPmT1h }}</div>
                      </div>
                    </v-flex>
                    <v-flex xs5>
                      <v-card-media
                        :src="afTomPmSkyImg"
                        height="100px"
                        contain
                      ></v-card-media>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
          </v-flex>
        </v-layout>
      </div>
      <!-- For Mobile -->
      <div v-else>  
        <v-layout row ma-1>
          <v-flex xs4 order-md1 order-xs1>
            <v-card color="white" class="black--text">
                <v-container fluid grid-list-lg>
                  <v-layout row>
                    <v-flex xs7>
                      <div>
                        <div class="subheading">오늘</div>
                        <div class="title">{{ todayT1h }}</div>
                        <div>
                          <v-card-media
                            :src="todaySkyImg"
                            height="35px"
                            contain
                          ></v-card-media>
                        </div>
                        <div class="caption">{{ todayPm10 }}</div>
                        <div class="body-2">{{ weatherLoc }}</div>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
          </v-flex>

          <v-flex xs4 order-md2 order-xs2>
            <v-card color="white" class="black--text">
                <v-container fluid grid-list-lg>
                  <v-layout row>
                    <v-flex xs7>
                      <div>
                        <div class="subheading">내일</div>
                        <div class="body-1"><span style="white-space:nowrap">오전&nbsp;<img :src="tomAmSkyImg" height="30" width="30"/></span></div>
                        <div class="title">{{ tomorrowAmT1h }}</div>

                        <div class="body-1"><span style="white-space:nowrap">오후&nbsp;<img :src="tomPmSkyImg" height="30" width="30"/></span></div>
                        <div class="title">{{ tomorrowPmT1h }}</div>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
          </v-flex>

          <v-flex xs4 order-md3 order-xs3>
            <v-card color="white" class="black--text">
                <v-container fluid grid-list-lg>
                  <v-layout row>
                    <v-flex xs7>
                      <div>
                        <div class="subheading">모레</div>
                        <div class="body-1"><span style="white-space:nowrap">오전&nbsp;<img :src="afTomAmSkyImg" height="30" width="30"/></span></div>
                        <div class="title">{{ afterTomorrowAmT1h }}</div>

                        <div class="body-1"><span style="white-space:nowrap">오후&nbsp;<img :src="afTomAmSkyImg" height="30" width="30"/></span></div>
                        <div class="title">{{ afterTomorrowPmT1h }}</div>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
          </v-flex>
        </v-layout>
      </div>

      <div>
	    <full-calendar :config="config" :events="events" @event-selected="eventSelected"/>
      <!-- <br/><br/><br/> -->
      <journalModal></journalModal>
      <journalModalForEdit></journalModalForEdit>
      <addWorkTypeModal></addWorkTypeModal>
      </div>
      <!-- FOR MOBILE -->
    <div v-if="$mq === 'mobile'">  
        
        <v-layout row ma-1 justify-center>
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer><b class="headline">- 품목별 가격정보 -</b>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-data-table
              :headers="headersForMobile"
              :items="crops"
              :rows-per-page-items=[5]
              class="elevation-1"
            >
              <template slot="headerCell" slot-scope="props">
                <v-tooltip bottom>
                  <span slot="activator">
                    {{ props.header.text }}
                  </span>
                  <span>
                    {{ props.header.text }}
                  </span>
                </v-tooltip>
              </template>
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.PRDLST_NM }}</td>
                <td class="text-xs-left">{{ props.item.PBLMNG_WHSAL_MRKT_NM }}</td>
                <td class="text-xs-left">{{ props.item.AVRG_AMT }}</td>
              </template>
            </v-data-table>
          </v-card>
        </v-layout>
          
        <v-layout row ma-1 justify-center>
          <v-card>
            <v-card-title>
                <v-spacer></v-spacer><b class="headline">- 작업 예측 -</b>
                <v-spacer></v-spacer>
              </v-card-title>
            <v-data-table
              :headers="headersForPredictMobile"
              :items="journals"
              :rows-per-page-items=[5]
              class="elevation-1"
            >
              <template slot="headerCell" slot-scope="props">
                <v-tooltip bottom>
                  <span slot="activator">
                    {{ props.header.text }}
                  </span>
                  <span>
                    {{ props.header.text }}
                  </span>
                </v-tooltip>
              </template>
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.cropName }}</td>
                <td class="text-xs-left">{{ props.item.date }}</td>
                <td class="text-xs-left">{{ props.item.workCode }}</td>
              </template>
            </v-data-table>
          </v-card>
        </v-layout>
      </div>

    </div>

    <div style="float: right; display: inline; width: 50%" v-if="$mq === 'laptop' || $mq === 'desktop'">
        <v-data-table
          :headers="headers"
          :items="crops"
          :rows-per-page-items=[10]
          class="elevation-1"
        >
          <template slot="headerCell" slot-scope="props">
            <v-tooltip bottom>
              <span slot="activator">
                {{ props.header.text }}
              </span>
              <span>
                {{ props.header.text }}
              </span>
            </v-tooltip>
          </template>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.PRDLST_NM }}</td>
            <td class="text-xs-right">{{ props.item.PBLMNG_WHSAL_MRKT_NM }}</td>
            <td class="text-xs-right">{{ props.item.GRAD }}</td>
            <td class="text-xs-right">{{ props.item.DELNGBUNDLE_QY }}{{ props.item.STNDRD }}</td>
            <td class="text-xs-right">{{ props.item.MUMM_AMT }}</td>
            <td class="text-xs-right">{{ props.item.AVRG_AMT }}</td>
            <td class="text-xs-right">{{ props.item.MXMM_AMT }}</td>
          </template>
        </v-data-table>
        <hr/>
        <v-data-table
          :headers="headersForPredict"
          :items="journals"
          :rows-per-page-items=[10]
          class="elevation-1"
        >
          <template slot="headerCell" slot-scope="props">
            <v-tooltip bottom>
              <span slot="activator">
                {{ props.header.text }}
              </span>
              <span>
                {{ props.header.text }}
              </span>
            </v-tooltip>
          </template>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.cropName }}</td>
            <td class="text-xs-right">{{ props.item.date }}</td>
            <td class="text-xs-right">{{ props.item.workCode }}</td>
            <td class="text-xs-right">{{ props.item.workContent }}</td>
            <td class="text-xs-right">{{ props.item.remarks }}</td>
          </template>
        </v-data-table>
    </div>
</div>
</template>

<script>
    import moment from 'moment'
    import {bus} from '../main'
    import JournalService from '@/services/JournalService'
    import WcService from '@/services/WcService'
    import ScService from '@/services/ScService'
    import LandService from '@/services/LandService'
    import WeatherService from '@/services/WeatherService'
    import PriceService from '@/services/PriceService'
    import proj4 from 'proj4'
    export default {
  data () {
        return {
          lastYearYM: '',
          calendarWidth: '',
          calendarHeight: '',
          startDate: '',
          endDate: '',
          journals: [],
          headersForPredict: [
            {
              text: '작물명',
              align: 'left',
              sortable: false,
              value: 'cropName'
            },
            { text: '작년날짜', value: 'date' },
            { text: '작업분류', value: 'workCode' },
            { text: '작업내용', value: 'workContent' },
            { text: '작년특기사항', value: 'remarks' }
          ],
          headersForPredictMobile: [
            {
              text: '작물명',
              align: 'left',
              sortable: false,
              value: 'cropName'
            },
            { text: '작년날짜', value: 'date' },
            { text: '작업분류', value: 'workCode' }
          ],
          headers: [
            {
              text: '품목명',
              align: 'left',
              sortable: false,
              value: 'PRDLST_NM'
            },
            { text: '도매시장명', value: 'PBLMNG_WHSAL_MRKT_NM' },
            { text: '등급', value: 'GRAD' },
            { text: '거래단량', value: 'DELNGBUNDLE_QY' },
            { text: '최소가', value: 'MUMM_AMT' },
            { text: '평균가', value: 'AVRG_AMT' },
            { text: '최대가', value: 'MXMM_AMT' }
          ],
          headersForMobile: [
            {
              text: '품목명',
              align: 'left',
              sortable: false,
              value: 'PRDLST_NM'
            },
            { text: '도매시장명', value: 'PBLMNG_WHSAL_MRKT_NM' },
            { text: '평균가', value: 'AVRG_AMT' }
          ],
          crops: [],
          myCrops: [],
          weatherLoc: '',
          todayPm10: '',
          afTomAmSkyImg: '',
          afTomPmSkyImg: '',
          tomPmSkyImg: '',
          tomAmSkyImg: '',
          todaySkyImg: '',
          afterTomorrowAmT1h: '',
          afterTomorrowPmT1h: '',
          tomorrowPmT1h: '',
          tomorrowAmT1h: '',
          todayT1h: '',
          // userId: '5af4fa281a1ee4261039149f',
          userId: '',
          events: [
            /*
            {
              title: 'test',
              allDay: true,
              start: moment(),
              end: moment().add(1, 'd'),
              url: 'http://www.daum.net'
            },
            {
              title: 'another test',
              start: moment().add(2, 'd'),
              end: moment().add(2, 'd').add(2, 'h')
            }
            */
          ],
          config: {
            // height: 500,
            header: { // https://jsfiddle.net/amitavroy/7Lew1zm3/
              left: 'prev,next',
              center: 'title',
              right: 'today'
            },
            aspectRatio: 1.5,
            locale: 'ko',
            defaultView: 'month',
            eventRender: function (event, element) {
              // console.log(event)
            },
            dayClick (date, event, view) {
              // console.log(date.format())
              var todayDate = moment().format('YYYY-MM-DD')
              var clickedDate = date.format()
              if (todayDate < clickedDate) {
              } else {
                bus.$emit('dialog', date.format())
              }
            }
          }
        }
  },
  beforeCreate: function () {
        if (!this.$session.exists()) {
          this.$router.push('/login')
        } else {
        }
  },
  created () {
        this.userId = this.$session.get('userId')
        // this.$refs.calendar.fireMethod('changeView', view)
        this.getJournal()
        this.getLocation()
        this.getMyCrop()
        this.getLastYearJournal()
        // media query
        if (this.$mq === 'desktop') {
          // this.calendarWidth = '900px'
          this.calendarWidth = '49%'
          this.calendarHeight = '900px'
          this.config.aspectRatio = 1.5
        } else {
          this.calendarWidth = '400px'
          this.calendarHeight = '400px'
          this.config.aspectRatio = 1
        }
  },
  mounted () {
        var vm = this
        bus.$on('toJournalForNew', function (value) {
          vm.events.push(value)
        })
        bus.$on('toJournalForUpdate', function (value) {
          vm.events.splice(value.eventIndex, 1)
          vm.events.push(value)
        })
        bus.$on('toJournalForDel', function (value) {
          for (var i = 0; i < vm.events.length; i++) {
            if (vm.events[i].eventIndex === value) {
              vm.events.splice(i, 1)
            }
          }
        })
  },
  methods: {
        eventSelected: function (event, jsEvent, view) {
          bus.$emit('dialogForEdit', event)
        },
        async getMyCrop () {
          this.myCrops = []
          const response = await LandService.fetchLands({
            userId: this.userId
          })
          for (var i = 0; i < response.data.lands.length; i++) {
            const response2 = await ScService.fetchCropNameByCropCode({
              cropCode: response.data.lands[i].cropCode
            })
            this.myCrops.push(response2.data[0].text)
          }
          // console.log(this.myCrops)
          for (var j = 0; j < this.myCrops.length; j++) {
            const response3 = await PriceService.fetchPriceData({
              productName: this.myCrops[j]
            })
            if (response3.data) {
              // console.log(response3.data.Grid_20150401000000000216_1.row)
              for (var k = 0; k < response3.data.Grid_20150401000000000216_1.row.length; k++) {
                response3.data.Grid_20150401000000000216_1.row[k].MUMM_AMT = '￦' + this.numberWithCommas(response3.data.Grid_20150401000000000216_1.row[k].MUMM_AMT)
                response3.data.Grid_20150401000000000216_1.row[k].AVRG_AMT = '￦' + this.numberWithCommas(response3.data.Grid_20150401000000000216_1.row[k].AVRG_AMT)
                response3.data.Grid_20150401000000000216_1.row[k].MXMM_AMT = '￦' + this.numberWithCommas(response3.data.Grid_20150401000000000216_1.row[k].MXMM_AMT)
                this.crops.push(response3.data.Grid_20150401000000000216_1.row[k])
              }
            }
          }
        },
        async getJournal () {
          const response = await JournalService.fetchJournals({
            userId: this.userId
          })
          for (var i = 0; i < response.data.length; i++) {
            var tmpEvent = {}
            const response2 = await WcService.fetchTextByCode({
              code: response.data[i].workCode
            })
            const response3 = await ScService.fetchCropNameByCropCode({
              cropCode: response.data[i].workCode.substring(0, 11)
            })
            const response4 = await LandService.fetchNameByLandId({
              landId: response.data[i].landId
            })
            tmpEvent.title = response4.data[0].name + ' - ' + response3.data[0].text + '\n' + response2.data[0].text + ' - ' + response.data[i].workContent
            var tmpSTime = response.data[i].date + ' ' + response.data[i].workSTime.substring(0, 2) + ':' + response.data[i].workSTime.substring(2, 4)
            var tmpETime = response.data[i].date + ' ' + response.data[i].workETime.substring(0, 2) + ':' + response.data[i].workETime.substring(2, 4)
            tmpEvent.start = tmpSTime
            tmpEvent.end = tmpETime
            tmpEvent.journalId = response.data[i]._id
            this.events.push(tmpEvent)
            tmpEvent.eventIndex = this.events.indexOf(tmpEvent)
            // console.log(this.events.indexOf(tmpEvent))
          }
        },
        async fetchTodayWeather (nx, ny) {
          const response = await WeatherService.fetchTodayWeather({
            nx: nx,
            ny: ny
          })
          for (var i = 0; i < response.data.item.length; i++) {
            var sky = 'SKY'
            var t1h = 'T1H'
            var reh = 'REH'
            if (sky === response.data.item[i].category) {
              switch (response.data.item[i].obsrValue) {
                case 1 :
                  // this.todaySky = '맑음'
                  this.todaySkyImg = require('../assets/sun.png')
                  break
                case 2 :
                  // this.todaySky = '구름조금'
                  this.todaySkyImg = require('../assets/cloud1.png')
                  break
                case 3 :
                  // this.todaySky = '구름많음'
                  this.todaySkyImg = require('../assets/cloud2.png')
                  break
                case 4 :
                  // this.todaySky = '흐림'
                  this.todaySkyImg = require('../assets/heu.png')
                  break
                default :
                  break
              }
            } else if (t1h === response.data.item[i].category) {
              this.todayT1h = response.data.item[i].obsrValue + '℃'
            } else if (reh === response.data.item[i].category) {
              this.todayREH = response.data.item[i].obsrValue + '%'
            }
          }
        },
        async fetchWeatherForecast (nx, ny) {
          const response = await WeatherService.fetchWeatherForecast({
            nx: nx,
            ny: ny
          })
          // TOMORROW START
          var todayDate = new Date()
          todayDate.setDate(todayDate.getDate() + 1)
          var todayYYYYMMDD = this.leadingZeros(todayDate.getFullYear(), 4) +
                              this.leadingZeros(todayDate.getMonth() + 1, 2) +
                              this.leadingZeros(todayDate.getDate(), 2) + ''
          this.tt1Date = todayYYYYMMDD.substring(4, 6) + '/' + todayYYYYMMDD.substring(6, 8)
          var onlyFcstDate = []
          for (var i = 0; i < response.data.item.length; i++) {
            if (todayYYYYMMDD === response.data.item[i].fcstDate + '') {
              onlyFcstDate.push(response.data.item[i])
            }
          }

          var onlyFcstTime = []
          var fcstTime = '0900'
          for (var j = 0; j < onlyFcstDate.length; j++) {
            if (fcstTime === onlyFcstDate[j].fcstTime) {
              onlyFcstTime.push(onlyFcstDate[j])
            }
          }

          var sky = 'SKY'
          var t3h = 'T3H'
          var reh = 'REH'
          for (var k = 0; k < onlyFcstTime.length; k++) {
            if (sky === onlyFcstTime[k].category) {
              switch (onlyFcstTime[k].fcstValue + '') {
                case '1' :
                  // this.tt1Sky = '맑음'
                  this.tomAmSkyImg = require('../assets/sun.png')
                  break
                case '2' :
                  // this.tt1Sky = '구름조금'
                  this.tomAmSkyImg = require('../assets/cloud1.png')
                  break
                case '3' :
                  // this.tt1Sky = '구름많음'
                  this.tomAmSkyImg = require('../assets/cloud2.png')
                  break
                case '4' :
                  // this.tt1Sky = '흐림'
                  this.tomAmSkyImg = require('../assets/heu.png')
                  break
                default :
                  break
              }
            } else if (t3h === onlyFcstTime[k].category) {
              this.tomorrowAmT1h = onlyFcstTime[k].fcstValue + '℃'
            } else if (reh === onlyFcstTime[k].category) {
              this.tt1Reh = onlyFcstTime[k].fcstValue + '%'
            }
          }

          onlyFcstTime = []
          fcstTime = '1200'
          for (j = 0; j < onlyFcstDate.length; j++) {
            if (fcstTime === onlyFcstDate[j].fcstTime + '') {
              onlyFcstTime.push(onlyFcstDate[j])
            }
          }

          for (k = 0; k < onlyFcstTime.length; k++) {
            if (sky === onlyFcstTime[k].category) {
              switch (onlyFcstTime[k].fcstValue + '') {
                case '1' :
                  this.tomPmSkyImg = require('../assets/sun.png')
                  break
                case '2' :
                  this.tomPmSkyImg = require('../assets/cloud1.png')
                  break
                case '3' :
                  this.tomPmSkyImg = require('../assets/cloud2.png')
                  break
                case '4' :
                  this.tomPmSkyImg = require('../assets/heu.png')
                  break
                default :
                  break
              }
            } else if (t3h === onlyFcstTime[k].category) {
              this.tomorrowPmT1h = onlyFcstTime[k].fcstValue + '℃'
            } else if (reh === onlyFcstTime[k].category) {
              this.tt1Reh = onlyFcstTime[k].fcstValue + '%'
            }
          }
          // TOMORROW END
          // AFTER TOMORROW START
          todayDate = new Date()
          todayDate.setDate(todayDate.getDate() + 2)
          todayYYYYMMDD = this.leadingZeros(todayDate.getFullYear(), 4) +
                              this.leadingZeros(todayDate.getMonth() + 1, 2) +
                              this.leadingZeros(todayDate.getDate(), 2) + ''
          this.tt2Date = todayYYYYMMDD.substring(4, 6) + '/' + todayYYYYMMDD.substring(6, 8)
          onlyFcstDate = []
          for (i = 0; i < response.data.item.length; i++) {
            if (todayYYYYMMDD === response.data.item[i].fcstDate + '') {
              onlyFcstDate.push(response.data.item[i])
            }
          }

          onlyFcstTime = []
          fcstTime = '0900'
          for (j = 0; j < onlyFcstDate.length; j++) {
            if (fcstTime === onlyFcstDate[j].fcstTime) {
              onlyFcstTime.push(onlyFcstDate[j])
            }
          }

          for (k = 0; k < onlyFcstTime.length; k++) {
            if (sky === onlyFcstTime[k].category) {
              switch (onlyFcstTime[k].fcstValue + '') {
                case '1' :
                  // this.tt2Sky = '맑음'
                  this.afTomAmSkyImg = require('../assets/sun.png')
                  break
                case '2' :
                  // this.tt2Sky = '구름조금'
                  this.afTomAmSkyImg = require('../assets/cloud1.png')
                  break
                case '3' :
                  // this.tt2Sky = '구름많음'
                  this.afTomAmSkyImg = require('../assets/cloud2.png')
                  break
                case '4' :
                  // this.tt2Sky = '흐림'
                  this.afTomAmSkyImg = require('../assets/heu.png')
                  break
                default :
                  break
              }
            } else if (t3h === onlyFcstTime[k].category) {
              this.afterTomorrowAmT1h = onlyFcstTime[k].fcstValue + '℃'
            } else if (reh === onlyFcstTime[k].category) {
              this.tt2Reh = onlyFcstTime[k].fcstValue + '%'
            }
          }

          onlyFcstTime = []
          fcstTime = '1200'
          for (j = 0; j < onlyFcstDate.length; j++) {
            if (fcstTime === onlyFcstDate[j].fcstTime + '') {
              onlyFcstTime.push(onlyFcstDate[j])
            }
          }

          for (k = 0; k < onlyFcstTime.length; k++) {
            if (sky === onlyFcstTime[k].category) {
              switch (onlyFcstTime[k].fcstValue + '') {
                case '1' :
                  this.afTomPmSkyImg = require('../assets/sun.png')
                  break
                case '2' :
                  this.afTomPmSkyImg = require('../assets/cloud1.png')
                  break
                case '3' :
                  this.afTomPmSkyImg = require('../assets/cloud2.png')
                  break
                case '4' :
                  this.afTomPmSkyImg = require('../assets/heu.png')
                  break
                default :
                  break
              }
            } else if (t3h === onlyFcstTime[k].category) {
              this.afterTomorrowPmT1h = onlyFcstTime[k].fcstValue + '℃'
            } else if (reh === onlyFcstTime[k].category) {
              this.tt2Reh = onlyFcstTime[k].fcstValue + '%'
            }
          }
          // AFTER TOMORROW END
        },
        async fetchAirData (tmX, tmY) {
          const response = await WeatherService.fetchAirData({
            tmX: tmX,
            tmY: tmY
          })
          // console.log(response.data.pm10Grade)
          switch (response.data.pm10Grade) {
            case '1' :
              this.todayPm10 = '미세먼지:좋음'
              break
            case '2' :
              this.todayPm10 = '미세먼지:보통'
              break
            case '3' :
              this.todayPm10 = '미세먼지:나쁨'
              break
            case '4' :
              this.todayPm10 = '미세먼지:매우나쁨'
              break
            default :
              break
          }
        },
        async getJournalsByDate () {
          const response = await JournalService.fetchJournalsByDateNUserId({
            startDate: this.startDate,
            endDate: this.endDate,
            userId: this.userId
          })
          if (response.data.length > 0) {
            var tmpJournals = response.data
            for (var i = 0; i < response.data.length; i++) {
              const response2 = await ScService.fetchCropNameByCropCode({
                cropCode: response.data[i].workCode.substring(0, 11)
              })
              tmpJournals[i].cropName = response2.data[0].text

              const response3 = await WcService.fetchTextByCode({
                code: response.data[i].workCode
              })
              tmpJournals[i].workCode = response3.data[0].text
            }
            this.journals = tmpJournals
          } else {
            const response4 = await JournalService.fetchJournalsByYMUserId({
              ym: this.lastYearYM,
              userId: this.userId
            })
            var tmpJournals2 = response4.data
            for (var j = 0; j < response4.data.length; j++) {
              const response5 = await ScService.fetchCropNameByCropCode({
                cropCode: response4.data[j].workCode.substring(0, 11)
              })
              tmpJournals2[j].cropName = response5.data[0].text
              const response6 = await WcService.fetchTextByCode({
                code: response4.data[j].workCode
              })
              tmpJournals2[j].workCode = response6.data[0].text
            }
            this.journals = tmpJournals2
          }
        },
        getLastYearJournal: function () {
          var today = moment()
          // var today = moment('20190628', 'YYYY-MM-DD')
          // console.log(today)
          var lastYear = today.subtract(1, 'year')
          var lastYearBefore10 = lastYear.subtract(10, 'day')
          this.startDate = lastYearBefore10.format('YYYY-MM-DD')
          // console.log(this.startDate)
          var lastYearAfter10 = lastYear.add(20, 'day')
          this.endDate = lastYearAfter10.format('YYYY-MM-DD')
          // console.log(this.endDate)
          this.lastYearYM = lastYear.format('YYYY-MM')
          // console.log(this.lastYearYM)

          this.getJournalsByDate()
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
              vm.weatherLoc = response.json.results[0].address_components[0].short_name

              var convertedXY = vm.dfs_xy_conv('toXY', response.json.results[0].geometry.location.lat, response.json.results[0].geometry.location.lng)
              vm.fetchTodayWeather(convertedXY.x, convertedXY.y)
              vm.fetchWeatherForecast(convertedXY.x, convertedXY.y)

              // https://www.npmjs.com/package/proj4
              // http://www.gisdeveloper.co.kr/?p=1854
              var firstProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
              var secondProjection = '+proj=longlat +ellps=bessel +towgs84=-146.43,507.89,681.46 +no_defs'
              var tmXY = proj4(firstProjection, secondProjection, [convertedXY.y, convertedXY.x])
              vm.fetchAirData(tmXY[0], tmXY[1])
            }
          })
        },
        /* OLD VERSION WITH "navigator.geolocation"
        locationError: function (err) {
          alert(err.code + '-' + err.message)
        },
        getLocation: function () {
          if (navigator.geolocation) {
            // navigator.geolocation.getCurrentPosition(this.showPosition)
            var options = {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
            navigator.geolocation.getCurrentPosition(this.showPosition, this.locationError, options)
          } else {
            console.log('Geolocation is not supported by this browser.')
          }
        },
        showPosition: function (position) {
          var vm = this
          // Reverse geo coding
          // https://github.com/googlemaps/google-maps-services-js
          var googleMapsClient = require('@google/maps').createClient({
            key: 'AIzaSyAbcu_ORn9DV9mv0GFbxwX3FrYFMyL-nRA'
          })
          var latlng = {lat: position.coords.latitude, lng: position.coords.longitude}
          googleMapsClient.reverseGeocode({
            latlng: latlng
          }, function (err, response) {
            if (!err) {
              // console.log(response.json.results[0].address_components[1].short_name)
              vm.weatherLoc = response.json.results[0].address_components[1].short_name
            }
          })

          var convertedXY = this.dfs_xy_conv('toXY', position.coords.latitude, position.coords.longitude)
          this.fetchTodayWeather(convertedXY.x, convertedXY.y)
          this.fetchWeatherForecast(convertedXY.x, convertedXY.y)

          // https://www.npmjs.com/package/proj4
          // http://www.gisdeveloper.co.kr/?p=1854
          var firstProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
          var secondProjection = '+proj=longlat +ellps=bessel +towgs84=-146.43,507.89,681.46 +no_defs'
          var tmXY = proj4(firstProjection, secondProjection, [convertedXY.y, convertedXY.x])
          this.fetchAirData(tmXY[0], tmXY[1])
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
        numberWithCommas: function (x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
  }
}
</script>