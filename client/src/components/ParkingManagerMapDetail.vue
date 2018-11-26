<template>
<v-dialog v-model="dialog" persistent max-width="600px" max-height="1000px">
  <v-card>
    <v-card-title class="headline">{{ parkingData.name }}({{ parkingData.no }})</v-card-title>
    <v-card-text>
      <v-tabs
        v-model="active"
        color="cyan"
        dark
        slider-color="yellow"
      >

      <v-tab>상세</v-tab>
      <v-tab>요금</v-tab>
      <v-tab>운영</v-tab>

      <v-tab-item>
        <v-card flat>
          <v-card-text>

            <v-flex xs12>
             <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">주소</h3>
                  <div>{{ parkingData.addr_road }} <br> {{ parkingData.addr_jibun }}</div>
                </div>
              </v-card-title>
            </v-flex>

            <v-flex xs12>
             <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">연락처</h3>
                  <div>{{ parkingData.tel }}</div>
                </div>
              </v-card-title>
            </v-flex>

            <v-flex xs12>
             <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">홈페이지</h3>
                  <div>{{ parkingData.homepage }}</div>
                </div>
              </v-card-title>
            </v-flex>

            <v-flex xs12>
             <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">주차면수</h3>
                  <div v-if="parkingData.park_space_count">소형:{{ parkingData.park_space_count.small }}, 
                       중형:{{ parkingData.park_space_count.mid }}, 
                       대형:{{ parkingData.park_space_count.big }}, 
                       전기:{{ parkingData.park_space_count.elec }}, 
                       장애:{{ parkingData.park_space_count.hand }}
                  </div>
                </div>
              </v-card-title>
            </v-flex>

          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>

            <v-flex xs12>
             <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">시간요금</h3>
                  <div v-if="parkingData.park_base && parkingData.add_term">기본요금:{{ parkingData.park_base.time }}분 {{ parkingData.park_base.fee }}원<br>추가요금:{{ parkingData.add_term.time }}분 당{{ parkingData.add_term.fee }}원
                  </div>
                </div>
              </v-card-title>
            </v-flex>

            <v-flex xs12>
             <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">일주차</h3>
                  <div>{{ parkingData.one_day_park_fee }}원</div>
                </div>
              </v-card-title>
            </v-flex>

            <v-flex xs12>
             <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">월주차</h3>
                  <div>{{ parkingData.month_fee }}원</div>
                </div>
              </v-card-title>
            </v-flex>

            <v-flex xs12>
             <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">할인정보</h3>
                  <div>{{ parkingData.sale_info }}</div>
                </div>
              </v-card-title>
            </v-flex>            

          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            
            <v-flex xs12>
             <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">운영시간</h3>
                  <div v-if="parkingData.w_op && parkingData.s_op && parkingData.h_op">평일:{{ parkingData.w_op.start_time }} ~ {{ parkingData.w_op.end_time }}<br>토요일:{{ parkingData.s_op.start_time }} ~ {{ parkingData.s_op.end_time }}<br>공휴일:{{ parkingData.h_op.start_time }} ~ {{ parkingData.h_op.end_time }}
                  </div>
                </div>
              </v-card-title>
            </v-flex>

          </v-card-text>
        </v-card>
      </v-tab-item>

      </v-tabs>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!--
      <v-btn v-if="1 == isDisplay" color="info" @click.native="setNoDisplay">비공개</v-btn>
      <v-btn v-else color="info" @click.native="setDisplay">공개</v-btn>
      -->
      <!--
      <v-select
          :items="displays"          
          menu-props="auto"
          label="공개여부"
          hide-details
          prepend-icon="map"
          single-line
          item-text="name"
          item-value="value"
          v-on:change="onChangeDisplay"
          v-model="selectDisplay"          
        ></v-select>
      -->
      <v-select
          :items="displays"
          v-model="parkingData.display"                  
          label="공개여부"
          prepend-icon="map"                 
          item-text="name"
          item-value="value"
          v-on:change="onChangeDisplay"        
        ></v-select>
      <v-btn color="success" @click.native="dialog = false">닫기</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import {bus} from '../main'
import ParkingService from '@/services/ParkingService'
import ReportService from '@/services/ReportService'
export default {
  components: {
  },
  data () {
    return {
      dialog: false,
      parkingData: {},
      active: null,
      displays: [
        { name: '공개', value: '1' },
        { name: '비공개', value: '0' }
      ]
    }
  },
  mounted () {
    var vm = this
    bus.$on('dialogForDetail', function (value) {
      vm.dialog = true
      vm.parkingData = value
    })
  },
  created () {
  },
  methods: {
    async updateParkingWithDisplay (displayVal) {
      const response = await ParkingService.updateParking({
        id: this.parkingData._id,
        display: displayVal
      })
      console.log(response.data)
    },
    async updateReportStatus (statusVal) {
      const response = await ReportService.updateReport({
        code: this.parkingData.no,
        status: statusVal
      })
      console.log(response.data)
    },
    setNoDisplay () {
      console.log('setNoDisplay')
      this.updateParkingWithDisplay('0')
      var codePrefix = this.parkingData.no.substr(0, 1)
      if (codePrefix === 'R') {
        this.updateReportStatus('1')
      }
    },
    setDisplay () {
      console.log('setDisplay')
      this.updateParkingWithDisplay('1')
      var codePrefix = this.parkingData.no.substr(0, 1)
      if (codePrefix === 'R') {
        this.updateReportStatus('2')
      }
    },
    onChangeDisplay: function (event) {
      switch (event) {
        case '1' :
          this.setDisplay()
          break
        case '0' :
          this.setNoDisplay()
          break
        default :
          break
      }
    }
  }
}
</script>