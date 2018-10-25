<template>
<v-container fluid>
  <v-container grid-list-md text-xs-center fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>일지 검색</h1>
      </v-flex>

      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

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
            :error-messages="errors.collect('startDate')" 
            label="시작날짜"
            prepend-icon="event"
            readonly
            required=""
            v-validate="'required'" 
            data-vv-name="startDate"
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
            :error-messages="errors.collect('endDate')" 
            label="종료날짜"
            prepend-icon="event"
            readonly
            required=""
            v-validate="'required'" 
            data-vv-name="endDate"
          ></v-text-field>
          <v-date-picker v-model="endDate" no-title scrollable locale='euc-kr'>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu2.save(endDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs4 sm4 md2>
        <!-- 
        <v-text-field
            v-model="workType"
            label="작업분류 입력"
            required
          ></v-text-field>
        -->
        <v-select
          :items="WorkTypeitems"
          v-model="e2"
          label="작업분류"
          class="input-group--focused"
          item-text="text"
          item-value="value"
          v-on:change="onChangeWorkType"
        ></v-select>
      </v-flex>
      <!--
      <v-flex xs6 sm6 md2>
        <v-text-field
            v-model="workContent"
            label="작업내용 입력"
            required
            outline
          ></v-text-field>
      </v-flex>
      -->

      <v-flex xs8 sm8 md2 class="text-xs-left">
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="light-blue"
          class="white--text"
          @click.native="searchJournals"
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
      
      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

      <!-- <div> -->
      
      <v-dialog v-model="dialog" max-width="500px">
      <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
      <v-card color="teal">
        <v-card-title>
          <span class="headline" style="color:white">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs6 sm6 md4>
                <!-- <v-text-field v-model="editedItem.farmName" label="농장명"></v-text-field> -->
                <v-select
                  :items="landItems"
                  v-model="editedItem.farmName"
                  label="농장명"
                  required
                  v-on:change="onChangeLand"
                  item-text="name"
                  item-value="_id"
                  solo
                ></v-select>
              </v-flex>
              <v-flex xs6 sm6 md4>
                <!-- <v-text-field v-model="editedItem.cropName" label="작물명"></v-text-field> -->
                <v-text-field
                  v-model="editedItem.cropName"
                  label="작물명" 
                  hint="농장명을 선택하면 자동입력됩니다"
                  persistent-hint
                  required
                  solo
                  ></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md4>
                <!-- <v-text-field v-model="editedItem.workType" label="작업분류"></v-text-field> -->
                <v-select
                  :items="editeWorkTypeItems"
                  v-model="editedItem.workType"
                  label="작업분류"
                  required
                  v-on:change="onChangeEditWorkType"
                  item-text="text"
                  item-value="_id"
                  hint="작물명에 따른 작업분류 선택"
                  persistent-hint
                  solo                  
                ></v-select>
              </v-flex>
              <v-flex xs6 sm12 md12>
                <v-text-field v-model="editedItem.workContent" label="작업내용" solo></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <!-- <v-text-field v-model="editedItem.workSTime" label="시작시간"></v-text-field> -->
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu4"
                  transition="scale-transition"
                  offset-y
                  :nudge-left="40"
                  disabled
                >
                  <v-text-field
                    v-model="e6"
                    label="작업시작 시간"
                    required
                    slot="activator"
                    prepend-icon="access_time"
                    readonly
                    v-on:change="onChangeWSTime"
                    disabled
                    solo
                  ></v-text-field>
                  <!-- <v-time-picker v-model="e6" format="24hr" autosave></v-time-picker> -->
                </v-menu>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <!-- <v-text-field v-model="editedItem.workETime" label="종료시간"></v-text-field> -->
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu5"
                  transition="scale-transition"
                  offset-y
                  :nudge-left="40"
                  disabled
                >
                  <v-text-field
                    v-model="e7"
                    label="작업종료 시간"
                    required
                    slot="activator"
                    prepend-icon="access_time"
                    readonly
                    v-on:change="onChangeWETime"
                    disabled
                    solo
                  ></v-text-field>
                  <!-- <v-time-picker v-model="e7" format="24hr" autosave></v-time-picker> -->
                </v-menu>
              </v-flex>
              <!--
               <v-flex xs3 sm6 md3>
                <v-text-field v-model="editedItem.sky" label="날씨" disabled solo></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field v-model="editedItem.t1h" label="온도" disabled solo></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field v-model="editedItem.reh" label="습도" disabled solo></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field v-model="editedItem.rn1" label="강수량" disabled solo></v-text-field>
              </v-flex>
              -->
              <v-flex xs12>
                <v-text-field v-model="editedItem.remarks" label="특기사항" solo></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outline color="white" flat @click.native="save">수정</v-btn>
          <v-btn outline color="white" flat @click.native="close">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    </v-layout>
  </v-container>

  <v-container fluid pa-0>
    <v-layout row wrap>
    
    <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

    <v-flex xs12 sm12 md8>
      <!-- <div v-if="$mq === 'laptop' || $mq === 'desktop'" ml-5> -->
        <div v-if="$mq === 'laptop' || $mq === 'desktop'">
        
        <v-data-table
          :headers="headers"
          :items="journals"
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
            <td class="text-xs-left">{{ props.item.date }}</td>
            <td class="text-xs-left">{{ props.item.cropName }}</td>
            <td class="text-xs-left">{{ props.item.workType }}</td>
            <td class="text-xs-left">{{ props.item.workContent }}</td>
            <td class="text-xs-left">{{ props.item.remarks }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
        
      </div>
      <!-- For Mobile -->
      <div v-else>
        <v-data-table
          :headers="headersForMobile"
          :items="journals"
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
            <td class="text-xs-left">{{ props.item.date }}</td>
            <td class="text-xs-left">{{ props.item.cropName }}</td>
            <td class="text-xs-left">{{ props.item.workType }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
      </div>
    </v-flex>
    <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />
    </v-layout>
  </v-container>
</v-container>
</template>

<script>
import JournalService from '@/services/JournalService'
import LandService from '@/services/LandService'
import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      editWorkCode: '',
      editDate: '',
      e7: null,
      e6: null,
      menu4: false,
      menu5: false,
      editedWorkTypeCode: '',
      editeWorkTypeItems: [],
      selectedCropCode: '',
      selectedLandId: '',
      landItems: [],
      selectedWorkType: '',
      e2: null,
      WorkTypeitems: [
        /*
          { text: '작물>출하', value: 'BCPW000' },
          { text: '작물>관수', value: 'BCPW001' },
          { text: '작물>비료사용', value: 'BCPW002' },
          { text: '작물>농약사용', value: 'BCPW003' },
          { text: '작물>파종', value: 'BCPW004' },
          { text: '작물>정식', value: 'BCPW005' },
          { text: '작물>제초', value: 'BCPW006' },
          { text: '작물>경운', value: 'BCPW007' },
          { text: '작물>기타 농업활동', value: 'BCPW008' },
          { text: '가축>출하', value: 'BALW000' },
          { text: '가축>관수', value: 'BALW001' },
          { text: '가축>사료사용', value: 'BALW002' },
          { text: '가축>청소', value: 'BALW003' },
          { text: '가축>기타', value: 'BALW004' },
          { text: '가축>병해충방제', value: 'BALW005' }
        */
      ],
      workContent: '',
      // userId: '5af4fa281a1ee4261039149f',
      userId: '',
      menu: false,
      menu2: false,
      startDate: null,
      endDate: null,
      loader: null,
      loading: false,
      search: '',
      pagination: {
        // https://github.com/vuetifyjs/vuetify/issues/442
        sortBy: 'date',
        descending: true
      },
      selected: [],
      dialog: false,
      formTitle: '',
      headers: [
        {
          text: '날짜',
          align: 'left',
          sortable: false,
          value: 'date',
          width: '15%'
        },
        { text: '작물명', value: 'cropName', align: 'left', width: '5%' },
        { text: '작업분류', value: 'workType', align: 'left', width: '5%' },
        { text: '작업내용', value: 'workContent', align: 'left', width: '30%' },
        { text: '특기사항', value: 'remarks', align: 'left', width: '30%' },
        { text: '관리', value: 'name', sortable: false, align: 'left', width: '5%' }
      ],
      headersForMobile: [
        {
          text: '날짜',
          align: 'left',
          sortable: false,
          value: 'date'
        },
        { text: '작물명', value: 'cropName', algin: 'left' },
        { text: '작업분류', value: 'workType', algin: 'left' },
        { text: 'Actions', value: 'name', sortable: false, algin: 'left' }
      ],
      editedIndex: -1,
      editedItem: {
        date: '',
        farmName: '',
        cropName: '',
        workType: '',
        workContent: '',
        workSTime: '08',
        workETime: '18',
        sky: '00',
        t1h: '01',
        reh: '02',
        rn1: '03',
        remarks: ''
      },
      journals: [],
      dictionary: {
        custom: {
          startDate: {
            required: '검색 시작날짜를 입력해주세요'
          },
          endDate: {
            required: '검색 종료날짜를 입력해주세요'
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
    this.getJournals()
    this.getLands()
    this.getWorkTypeItems()
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
    // formTitle () {
      // return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      // return this.journals[0].date
      // var tmpVal = this.editedIndex
      // return this.journals[tmpVal].date
    // },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },
  methods: {
    async getWorkTypeItems () {
      const response = await WcService.fetchDistinctBCPText({})
      for (var i = 0; i < response.data.length; i++) {
        const response2 = await WcService.fetchBCPDataByText({
          bcpText: response.data[i]
        })
        var tmpItem = {}
        tmpItem.text = '작물>' + response2.data.text
        tmpItem.value = response2.data.bCode + response2.data.wCode
        this.WorkTypeitems.push(tmpItem)
      }

      const response3 = await WcService.fetchDistinctBALText({})
      for (var j = 0; j < response3.data.length; j++) {
        const response4 = await WcService.fetchBALDataByText({
          balText: response3.data[j]
        })
        var tmpItem2 = {}
        tmpItem2.text = '가축>' + response4.data.text
        tmpItem2.value = response4.data.bCode + response4.data.wCode
        this.WorkTypeitems.push(tmpItem2)
      }
    },
    async getLands () {
      const response = await LandService.fetchLands({
        userId: this.userId
      })
      this.landItems = response.data.lands
    },
    async getJournals () {
      const response = await JournalService.fetchJournals({
        userId: this.userId
      })
      var tmpJournals = response.data
      for (var i = 0; i < response.data.length; i++) {
        const response2 = await LandService.fetchNameByLandId({
          landId: response.data[i].landId
        })
        tmpJournals[i].farmName = response2.data[0].name

        const response3 = await ScService.fetchCropNameByCropCode({
          cropCode: response.data[i].workCode.substring(0, 11)
        })
        tmpJournals[i].cropName = response3.data[0].text

        const response4 = await WcService.fetchTextByCode({
          code: response.data[i].workCode
        })
        tmpJournals[i].workType = response4.data[0].text
      }
      this.journals = tmpJournals
    },
    async getJournalsBy4 () {
      var tmpWorkType = this.selectedWorkType
      if (!tmpWorkType) {
        tmpWorkType = 0
      }
      var tmpWorkContent = this.workContent
      if (!tmpWorkContent) {
        tmpWorkContent = 0
      }
      const response = await JournalService.fetchJournalsBy4({
        startDate: this.startDate,
        endDate: this.endDate,
        workType: tmpWorkType,
        workContent: tmpWorkContent
      })
      var tmpJournals = response.data
      for (var i = 0; i < response.data.length; i++) {
        const response2 = await LandService.fetchNameByLandId({
          landId: response.data[i].landId
        })
        tmpJournals[i].farmName = response2.data[0].name

        const response3 = await ScService.fetchCropNameByCropCode({
          cropCode: response.data[i].workCode.substring(0, 11)
        })
        tmpJournals[i].cropName = response3.data[0].text

        const response4 = await WcService.fetchTextByCode({
          code: response.data[i].workCode
        })
        tmpJournals[i].workType = response4.data[0].text
      }
      this.journals = tmpJournals
    },
    async deleteJournal (id) {
      await JournalService.deleteJournal(id)
    },
    async updateJournal () {
      await JournalService.updateJournal({
        id: this.editedItem._id,
        userId: this.userId,
        date: this.editDate,
        landId: this.selectedLandId,
        workCode: this.editWorkCode,
        workContent: this.editedItem.workContent,
        workSTime: this.editedItem.workSTime,
        workETime: this.editedItem.workETime,
        weather: [{'baseTime': '1400', 'sky': '00', 't1h': '17', 'reh': '01', 'rn1': '02'}],
        remarks: this.editedItem.remarks
      })
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
      this.editedItem.cropName = response.data[0].text
    },
    async getWorkTypeByCropCode (cropCode) {
      const response = await WcService.fetchTextByCropCode({
        cropCode: cropCode
      })
      this.editeWorkTypeItems = response.data
    },
    async getIdByWorkCode (workCode) {
      const response = await WcService.fetchIdByWorkCode({
        code: workCode
      })
      this.editedItem.workType = response.data[0]._id
    },
    async getWorkCodeById (workId) {
      const response = await WcService.fetchWorkCodeById({
        id: workId
      })
      this.editedWorkTypeCode = response.data
    },
    onChangeWSTime: function (event) {
      var tmpStr = event
      this.editedItem.workSTime = tmpStr.replace(':', '')
      console.log(this.editedItem.workSTime)
    },
    onChangeWETime: function (event) {
      var tmpStr = event
      this.editedItem.workETime = tmpStr.replace(':', '')
      console.log(this.editedItem.workETime)
    },
    onChangeEditWorkType: function (event) {
      this.getWorkCodeById(event)
    },
    onChangeLand: function (event) {
      this.selectedLandId = event
      this.getCropCodeByLandId(this.selectedLandId)
    },
    onChangeWorkType: function (event) {
      this.selectedWorkType = event
    },
    editItem (item) {
      this.editedIndex = this.journals.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.farmName = this.journals[this.editedIndex].landId
      this.selectedLandId = this.journals[this.editedIndex].landId
      this.getCropCodeByLandId(this.journals[this.editedIndex].landId)
      this.editWorkCode = this.journals[this.editedIndex].workCode
      this.getIdByWorkCode(this.editWorkCode)
      this.e6 = this.journals[this.editedIndex].workSTime.substring(0, 2) + ':' + this.journals[this.editedIndex].workSTime.substring(2, 4)
      this.e7 = this.journals[this.editedIndex].workETime.substring(0, 2) + ':' + this.journals[this.editedIndex].workETime.substring(2, 4)
      this.editedItem.sky = this.journals[this.editedIndex].weather[0].sky
      this.editedItem.t1h = this.journals[this.editedIndex].weather[0].t1h
      this.editedItem.reh = this.journals[this.editedIndex].weather[0].reh
      this.editedItem.rn1 = this.journals[this.editedIndex].weather[0].rn1
      this.dialog = true
      this.editDate = this.journals[this.editedIndex].date
      this.formTitle = '영농일지 - ' + this.journals[this.editedIndex].date
    },
    deleteItem (item) {
      const index = this.journals.indexOf(item)
      // confirm('이 일지를 지우시겠습니까?') && this.journals.splice(index, 1) && this.deleteJournal(item._id)
      this.$swal({
        title: '이 일지를 삭제 하시겠습니까?',
        text: '삭제 후에 되돌릴 수 없습니다',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소합니다'
      }).then((result) => {
        if (result.value) {
          this.deleteJournal(item._id)
          this.journals.splice(index, 1)
          this.$swal(
            '삭제했습니다!',
            '일지가 삭제되었습니다',
            'success'
          )
        }
      })
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    searchJournals () {
      this.loader = 'loading'
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.getJournalsBy4()
      }).catch(() => {})
    },
    searchReset () {
      this.startDate = ''
      this.endDate = ''
      this.e2 = null
      this.workContent = null
      this.getJournals()
      this.getLands()
      this.$validator.reset()
    },
    save () {
      this.updateJournal()
      this.$swal({
        type: 'success',
        title: '일지를 수정하였습니다',
        showConfirmButton: false,
        timer: 777
      })
      this.dialog = false
      /*
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.updateJournal()
        this.dialog = false
      }).catch(() => {})
      */
    }
  }
}
</script>