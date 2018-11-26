<template>
<v-container fluid>
  <v-container grid-list-md text-xs-center fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>제보 관리</h1>
      </v-flex>

      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md1 />

      <!--  검색 시작 -->
       <v-flex xs6 sm6 md2>
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          v-model="menu"
          :nudge-right="40"
          :return-value.sync="startDate"
          lazy
          transition="scale-transition"
          offset-y
        >
          <v-text-field
            slot="activator"
            v-model="startDate"            
            label="제보-기간날짜"
            prepend-icon="event"
            readonly            
          ></v-text-field>
          <v-date-picker v-model="startDate" no-title scrollable locale='euc-kr'>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu.save(startDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs6 sm6 md2>
        <v-menu
          ref="menu2"
          :close-on-content-click="false"
          v-model="menu2"
          :nudge-right="40"
          :return-value.sync="endDate"
          lazy
          transition="scale-transition"
          offset-y
        >
          <v-text-field
            slot="activator"
            v-model="endDate"            
            label="제보-기간날짜"
            prepend-icon="event"
            readonly            
          ></v-text-field>
          <v-date-picker v-model="endDate" no-title scrollable locale='euc-kr'>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu2.save(endDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs4 sm4 md2>
        <v-select
          :items="SearchTypeItems"
          v-model="e2"
          label="검색어 분류"
          class="input-group--focused"
          item-text="text"
          item-value="value"
          v-on:change="onChangeSearchType"
        ></v-select>
      </v-flex>

      <v-flex xs4 sm4 md2>
        <v-text-field
            v-model="searchContent"
            label="검색어"
            required
            outline 
            v-if="setDisable()"
            v-on:keyup="runSearch"></v-text-field>
        <v-select
          :items="SearchContentStatusItems"
          v-model="e3"
          label="상태 분류"
          class="input-group--focused"
          item-text="text"
          item-value="value"
          v-on:change="onChangeSearchContentStatus"
          v-if="!setDisable()"></v-select>
      </v-flex>
      <!--
      <v-flex xs4 sm4 md2>
        <v-text-field
            v-model="searchContent"
            label="검색어"
            required
            outline
            v-on:keyup.enter="onEnterClick"></v-text-field>
      </v-flex>
      -->

      <v-flex xs8 sm8 md2 class="text-xs-left">
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="light-blue"
          class="white--text"
          @click.native="searchReports"
        >
          검색
        </v-btn>
        <v-btn
          color="orange lighten-3"
          class="white--text"
          @click.native="searchReset"
        >
          초기화
        </v-btn>
      </v-flex>
      <!-- 검색 끝 -->

      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />
      
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <!-- <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn> -->
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="save">저장</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-list three-line subheader>
            <v-subheader>제보 정보</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>제보일</v-list-tile-title>
                <v-list-tile-sub-title>{{ editedItem.report_date }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>제보자</v-list-tile-title>
                <v-list-tile-sub-title>{{ editedItem.user_email }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>제보자 연락처</v-list-tile-title>
                <v-list-tile-sub-title>{{ editedItem.user_phone_no }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>            
          </v-list>
          <v-divider></v-divider>

          <v-list three-line subheader>
            <v-subheader>주차장 기본정보</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>GPS</v-list-tile-title>
                <v-list-tile-sub-title>{{ editedItem.parking_lat }}, {{ editedItem.parking_lng }} 
                  <v-btn color="info" @click.native="runDaumMap">맵에서 보기</v-btn>                
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>주차장 연락처</v-list-tile-title>
                <v-list-tile-sub-title>{{ editedItem.parking_tel }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>            
          </v-list>
          <v-divider></v-divider>          

          <v-list three-line subheader>
            <v-subheader>주차장 요금정보</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>요금</v-list-tile-title>
                <v-list-tile-sub-title>{{ editedItem.parking_fee_info }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>기타정보</v-list-tile-title>
                <v-list-tile-sub-title>{{ editedItem.parking_etc_info }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>
          
          <v-list three-line subheader>
            <v-subheader>주차장 사진정보</v-subheader>               
            <v-card>
              <v-container grid-list-sm fluid>
                <v-layout row wrap>
                  <v-flex                    
                    xs4
                    d-flex
                  >
                    <v-card flat tile class="d-flex">
                      <img :src="editedItem.parking_pictureA" height="400" @click="runImage(editedItem.parking_pictureA)">                      
                    </v-card>
                  </v-flex>
                  <v-flex                    
                    xs4
                    d-flex
                  >
                    <v-card flat tile class="d-flex">
                      <img :src="editedItem.parking_pictureB" height="400" @click="runImage(editedItem.parking_pictureB)">                      
                    </v-card>
                  </v-flex>
                  <v-flex                    
                    xs4
                    d-flex
                  >
                    <v-card flat tile class="d-flex">
                      <img :src="editedItem.parking_pictureC" height="400" @click="runImage(editedItem.parking_pictureC)">                      
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>                 
          </v-list>
          <v-divider></v-divider>

          <v-list three-line subheader>
            <v-subheader>제보 상태</v-subheader>
            <v-list-tile avatar>
              <v-flex xs4 sm4 md2>
                <v-select
                  :items="ReportStatusItems"
                  v-model="editedItem.status"
                  label="제보 상태 선택"
                  class="input-group--focused"
                  item-text="text"
                  item-value="value"
                  v-on:change="onChangeReportStatus"
                  :disabled="checkReportStatus()"
                ></v-select>
              </v-flex>
            </v-list-tile>

            <v-list-tile avatar v-if="setHoldReasonDisable()">
              <v-list-tile-content>
                <v-list-tile-title>보류사유</v-list-tile-title>
                <v-list-tile-sub-title>
                  <v-text-field
                    v-model="holdReason"
                    label="보류사유 입력"
                    required
                    outline 
                  ></v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

          </v-list>
          <v-divider></v-divider>

          <v-list v-if="editedItem.delete_status === '1'" three-line subheader>
            <v-subheader>삭제 요청</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>삭제사유</v-list-tile-title>
                <v-list-tile-sub-title>{{ editedItem.delete_reason }}
                  <v-btn color="error" @click.native="deleteReport">삭제</v-btn>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>            
          </v-list>
          <v-divider></v-divider>

        </v-card>
      </v-dialog>
    
    </v-layout>
  </v-container>

  <v-container fluid pa-0>
    <v-layout row wrap>
    
    <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

    <v-flex xs12 sm12 md12>
        <v-data-table
          :headers="headers"
          :items="reports"
          :search="search"
          :pagination.sync="pagination"
          hide-actions
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
            <td class="text-xs-left">{{ props.item.code }}</td>
            <td class="text-xs-left">{{ props.item.parking_name }}</td>
            <td class="text-xs-left">{{ props.item.user_email }}</td>
            <td class="text-xs-left">{{ props.item.user_phone_no }}</td>
            <td class="text-xs-left">{{ props.item.report_date }}</td>
            <td class="text-xs-left">{{ props.item.statusValue }}</td>                                 
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <!--
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
              -->
              <h4 v-if="props.item.delete_status === '1'" class="mt-3">삭제요청</h4>
            </td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
    </v-flex>
    <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />
    </v-layout>

    <div>
      <daumMapModal></daumMapModal>
      <imageModal></imageModal>
    </div>

  </v-container>
</v-container>
</template>

<script>
import ReportService from '@/services/ReportService'
import {bus} from '../main'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      SearchContentStatusItems: [
          { text: '접수', value: '0' },
          { text: '승인중', value: '1' },
          { text: '승인', value: '2' },
          { text: '보류', value: '3' }
      ],
      gpsData: {},
      e3: null,
      searchContentDisabled: true,
      searchContent: null,
      selectedSearchType: null,
      e2: null,
      holdReason: null,
      holdReasonDisabled: false,
      ReportStatusItems: [
          { text: '접수', value: '0' },
          { text: '승인중', value: '1' },
          { text: '승인', value: '2' },
          { text: '보류', value: '3' }
      ],
      SearchTypeItems: [
          { text: '코드', value: 'byCode' },
          { text: '상태', value: 'byStatus' },
          { text: '제보자', value: 'byUserEmail' },
          { text: '주차장명', value: 'byParkingName' }
      ],
      menu: false,
      menu2: false,
      startDate: null,
      endDate: null,
      show1: false,
      search: null,
      loader: null,
      loading: false,
      pagination: {
        // https://github.com/vuetifyjs/vuetify/issues/442
        sortBy: 'date',
        descending: true
      },
      dialog: false,
      formTitle: '',
      headers: [
        {
          text: '코드',
          align: 'left',
          sortable: false,
          value: 'code',
          width: '15%'
        },
        { text: '주차장명', value: 'parking_name', align: 'left', width: '15%' },
        { text: '제보자', value: 'user_email', align: 'left', width: '15%' },
        { text: '제보자 연락처', value: 'user_phone_no', align: 'left', width: '10%' },
        { text: '제보일', value: 'report_date', align: 'left', width: '12%' },
        { text: '상태', value: 'status', align: 'left', width: '5%' },
        { text: '관리', value: 'manage', sortable: false, align: 'left', width: '5%' }
      ],
      editedIndex: -1,
      editedItem: {
        parking_name: '',
        report_date: '',
        user_email: '',
        user_phone_no: '',
        code: '',
        parking_lat: '',
        parking_lng: '',
        parking_tel: '',
        parking_fee_info: '',
        parking_etc_info: '',
        parking_pictureA: '',
        parking_pictureB: '',
        parking_pictureC: '',
        status: '',
        delete_status: '',
        delete_reason: ''
      },
      reports: [],
      dictionary: {
        custom: {
          name: {
            required: '이름을 입력해주세요'
          },
          email: {
            required: '이메일 주소를 입력해주세요'
          },
          password: {
            required: '비밀번호를 입력해주세요(문자, 숫자, 특수기호 조합)'
          },
          password2: {
            required: '같은 비밀번호를 입력해주세요'
          },
          phoneNo: {
            required: '휴대폰번호를 입력해주세요'
          },
          level: {
            required: '권한을 선택해주세요'
          }
        }
      }
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
  created () {
    this.userId = this.$session.get('userId')
    this.getAllReports()
  },
  watch: {
    loader () {
      const l = this.loader
      this[l] = !this[l]
      setTimeout(() => (this[l] = false), 1000)
      this.loader = null
    }
  },
  computed: {
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },
  methods: {
    async getAllReports () {
      const response = await ReportService.fetchAllReport({
      })
      this.reports = response.data

      for (var i = 0; i < this.reports.length; i++) {
        switch (this.reports[i].status) {
          case '0' :
            this.reports[i].statusValue = '접수'
            break
          case '1' :
            this.reports[i].statusValue = '승인중'
            break
          case '2' :
            this.reports[i].statusValue = '승인'
            break
          case '3' :
            this.reports[i].statusValue = '보류'
            break
        }
        switch (this.reports[i].delete_status) {
          case '0' :
            this.reports[i].deleteStatusValue = '삭제요청없음'
            break
          case '1' :
            this.reports[i].deleteStatusValue = '삭제요청'
            break
          case '2' :
            this.reports[i].deleteStatusValue = '삭제완료'
            break
          case '3' :
            this.reports[i].deleteStatusValue = '삭제보류'
            break
        }
      }
    },
    async getReportsBy4 () {
      var tmpSearchType = this.selectedSearchType
      if (!tmpSearchType) {
        tmpSearchType = 0
      }
      var tmpSearchContent = this.searchContent
      if (!tmpSearchContent) {
        tmpSearchContent = 0
      }
      const response = await ReportService.fetchReportsBy4({
        startDate: this.startDate,
        endDate: this.endDate,
        searchType: tmpSearchType,
        searchContent: tmpSearchContent
      })
      this.reports = response.data

      for (var i = 0; i < this.reports.length; i++) {
        switch (this.reports[i].status) {
          case '0' :
            this.reports[i].statusValue = '접수'
            break
          case '1' :
            this.reports[i].statusValue = '승인중'
            break
          case '2' :
            this.reports[i].statusValue = '승인'
            break
          case '3' :
            this.reports[i].statusValue = '보류'
            break
        }
      }
    },
    async updateReportStatus (statusVal) {
      const response = await ReportService.updateReportWithHoldreason({
        code: this.reports[this.editedIndex].code,
        status: statusVal,
        hold_reason: this.holdReason
      })
      console.log(response.data)
    },
    async deleteReportWithCode () {
      const response = await ReportService.deleteReport({
        code: this.reports[this.editedIndex].code
      })
      console.log(response.data)
    },
    searchReports () {
      this.loader = 'loading'
      this.getReportsBy4()
    },
    editItem (item) {
      this.editedIndex = this.reports.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.formTitle = this.reports[this.editedIndex].parking_name + '(' + this.reports[this.editedIndex].code + ')'
      if (this.editedItem.parking_pictureA !== undefined) {
        this.editedItem.parking_pictureA = 'http://192.168.0.73:9081/getReportImg/' + this.editedItem.parking_pictureA
      }
      if (this.editedItem.parking_pictureB !== undefined) {
        this.editedItem.parking_pictureB = 'http://192.168.0.73:9081/getReportImg/' + this.editedItem.parking_pictureB
      }
      if (this.editedItem.parking_pictureC !== undefined) {
        this.editedItem.parking_pictureC = 'http://192.168.0.73:9081/getReportImg/' + this.editedItem.parking_pictureC
      }
      this.gpsData.lat = this.editedItem.parking_lat
      this.gpsData.lng = this.editedItem.parking_lng
      this.ReportStatusItems = [{ text: '접수', value: '0' }, { text: '승인중', value: '1' }, { text: '승인', value: '2' }, { text: '보류', value: '3' }]
      this.holdReasonDisabled = false
      if (this.editedItem.status === '0') {
        this.ReportStatusItems.splice(1, 2)
      }
    },
    setHoldReasonDisable () {
      return this.holdReasonDisabled
    },
    runDaumMap () {
      bus.$emit('dialogForDaumMap', this.gpsData)
    },
    runImage (imgSrc) {
      // console.log(imgSrc)
      bus.$emit('dialogForImage', imgSrc)
    },
    setDisable () {
      return this.searchContentDisabled
    },
    searchReset () {
      this.startDate = ''
      this.endDate = ''
      this.e2 = null
      this.searchContent = ''
      this.searchContentDisabled = true
      this.getAllReports()
      // this.$validator.reset()
    },
    runSearch: function (e) {
      if (e.keyCode === 13) {
        this.searchReports()
      }
    },
    onChangeSearchType: function (event) {
      this.selectedSearchType = event
      if (event === 'byStatus') {
        this.searchContentDisabled = false
      } else {
        this.searchContentDisabled = true
      }
    },
    onEnterClick: function () {
      this.searchReports()
    },
    onChangeReportStatus: function (event) {
      // console.log(event)
      if (event === '3') {
        this.holdReasonDisabled = true
      } else {
        this.holdReasonDisabled = false
      }
    },
    onChangeSearchContentStatus: function (event) {
      this.searchContent = event
    },
    save () {
      this.updateReportStatus(this.editedItem.status)
      this.dialog = false
    },
    checkReportStatus () {
      // if (this.editedItem.status === '0' || this.editedItem.status === '3') {   // '접수', '보류'상태인 것만 상태수정 가능
      if (this.editedItem.status === '0') {   // '접수' 상태인 것만 상태수정 가능
        return false
      } else {
        return true
      }
    },
    deleteReport () {
      const index = this.editedIndex
      this.$swal({
        title: '이 제보를 삭제 하시겠습니까?',
        text: '삭제 후에 되돌릴 수 없습니다',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소합니다'
      }).then((result) => {
        if (result.value) {
          this.deleteReportWithCode()
          this.reports.splice(index, 1)
          this.dialog = false
          this.$swal(
            '삭제했습니다!',
            '제보가 삭제되었습니다',
            'success'
          )
        }
      })
    }
  }
}
</script>