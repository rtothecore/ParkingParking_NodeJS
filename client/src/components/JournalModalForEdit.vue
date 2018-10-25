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
              <v-flex xs6 sm6 md6>
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
              <v-flex xs6 sm6 md6>
                <v-text-field
                  v-model="cropName"
                  label="작물명" 
                  hint="농장명을 선택하면 자동입력됩니다"
                  persistent-hint
                  required
                  solo
                  ></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <v-select
                  v-validate="'required'"
                  :items="workType"
                  v-model="selectWorkType"
                  :error-messages="errors.collect('selectWorkType')"
                  label="작업분류"
                  data-vv-name="selectWorkType"
                  required
                  v-on:change="onChangeWorkType"
                  item-text="text"
                  item-value="_id"
                  hint="작물명에 따른 작업분류 선택"
                  persistent-hint
                  solo                  
                ></v-select>
              </v-flex>
              <v-flex xs6 sm6 md6>
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
                  disabled
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
                    disabled
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
                  disabled
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
                    disabled
                    solo
                  ></v-text-field>
                  <v-time-picker v-model="e7" format="24hr" autosave></v-time-picker>
                </v-menu>
              </v-flex>
              <!--
              <v-flex xs3 sm6 md3>
                <v-text-field
                  v-model="weatherSky"
                  label="날씨" 
                  hint="자동입력"
                  persistent-hint
                  required
                  disabled
                  solo
                  ></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field
                  v-model="weatherT1h"
                  label="온도" 
                  hint="자동입력"
                  persistent-hint
                  required
                  disabled
                  solo
                  ></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field
                  v-model="weatherReh"
                  label="습도" 
                  hint="자동입력"
                  persistent-hint
                  required
                  disabled
                  solo
                  ></v-text-field>
              </v-flex>
              <v-flex xs3 sm6 md3>
                <v-text-field
                  v-model="weatherRn1"
                  label="강수량" 
                  hint="자동입력"
                  persistent-hint
                  required
                  disabled
                  solo
                  ></v-text-field>
              </v-flex>
              -->
              <v-flex xs12>
                <v-text-field v-model="remarks" label="특기사항" solo></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*필수 입력 사항입니다</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outline color="white" flat @click.native="deleteJ">삭제</v-btn>
          <v-btn outline color="white" flat @click.native="save">수정</v-btn>
          <v-btn outline color="white" flat @click.native="dialog = false">닫기</v-btn>
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
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      updatedEvent: {},
      eventIndex: '',
      weatherSky: '',
      weatherT1h: '',
      weatherReh: '',
      weatherRn1: '',
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
      selectWorkType: '',
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
    bus.$on('dialogForEdit', function (value) {
      Object.assign(vm.$data, vm.$options.data.call(vm))  // initialize this data
      vm.journalId = value.journalId
      vm.eventIndex = value.eventIndex
      vm.dialog = true
      vm.getJournal()
      vm.getLands()
    })
  },
  created () {
    this.getLands()
  },
  methods: {
    async getJournal () {
      const response = await JournalService.fetchJournal({
        id: this.journalId
      })
      this.User_Profile = '영농일지 수정 - ' + response.data[0].date
      this.selectLand = response.data[0].landId
      this.getCropCodeByLandId(this.selectLand)
      this.selectedWorkTypeCode = response.data[0].workCode
      this.getIdByWorkCode(response.data[0].workCode)
      this.workContent = response.data[0].workContent
      this.e6 = response.data[0].workSTime.substring(0, 2) + ':' + response.data[0].workSTime.substring(2, 4)
      this.e7 = response.data[0].workETime.substring(0, 2) + ':' + response.data[0].workETime.substring(2, 4)
      if (response.data[0].weather[0]) {
        this.weatherSky = response.data[0].weather[0].sky
        this.weatherT1h = response.data[0].weather[0].t1h
        this.weatherReh = response.data[0].weather[0].reh
        this.weatherRn1 = response.data[0].weather[0].rn1
      } else {
        this.weatherSky = ''
        this.weatherT1h = ''
        this.weatherReh = ''
        this.weatherRn1 = ''
      }
      this.remarks = response.data[0].remarks
    },
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
    async getIdByWorkCode (workCode) {
      const response = await WcService.fetchIdByWorkCode({
        code: workCode
      })
      this.selectWorkType = response.data[0]._id
    },
    async getWorkCodeById (id) {
      const response = await WcService.fetchWorkCodeById({
        id: id
      })
      this.selectedWorkTypeCode = response.data
    },
    async updateJournal () {
      await JournalService.updateJournal({
        id: this.journalId,
        userId: this.userId,
        date: this.User_Profile.substring(10, 20),
        landId: this.selectLand,
        workCode: this.selectedWorkTypeCode,
        workContent: this.workContent,
        /*
        workSTime: this.e6.replace(':', ''),
        workETime: this.e7.replace(':', ''),
        weather: [{'baseTime': '1400', 'sky': '00', 't1h': '17', 'reh': '01', 'rn1': '02'}],
        */
        remarks: this.remarks
      })
      this.fetchNameByLandId(this.selectLand)
      this.fetchCropNameByCropCode(this.selectedWorkTypeCode.substring(0, 11))
      this.fetchTextByCode(this.selectedWorkTypeCode)
      this.updatedEvent.start = this.User_Profile.substring(10, 20) + ' ' + this.e6
      this.updatedEvent.end = this.User_Profile.substring(10, 20) + ' ' + this.e7
      this.updatedEvent.journalId = this.journalId
      this.updatedEvent.eventIndex = this.eventIndex
    },
    async deleteJournal (id) {
      await JournalService.deleteJournal(id)
    },
    async fetchNameByLandId (landId) {
      const response = await LandService.fetchNameByLandId({
        landId: landId
      })
      this.updatedEvent.title = response.data[0].name
    },
    async fetchCropNameByCropCode (cropCode) {
      const response = await ScService.fetchCropNameByCropCode({
        cropCode: cropCode
      })
      this.updatedEvent.title += ' - ' + response.data[0].text
    },
    async fetchTextByCode (workCode) {
      const response = await WcService.fetchTextByCode({
        code: workCode
      })
      this.updatedEvent.title += '\n' + response.data[0].text + ' - ' + this.workContent
    },
    onChangeLand: function (event) {
      this.selectedLandId = event
      this.getCropCodeByLandId(this.selectedLandId)
    },
    onChangeWorkType: function (event) {
      this.getWorkCodeById(event)
    },
    onChangeWSTime: function (event) {
      var tmpStr = event
      this.selectedWSTime = tmpStr.replace(':', '')
      console.log(this.selectedWSTime)
    },
    onChangeWETime: function (event) {
      var tmpStr = event
      this.selectedWETime = tmpStr.replace(':', '')
      console.log(this.selectedWETime)
    },
    save () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.updateJournal()
        this.$swal({
          type: 'success',
          title: '일지를 수정하였습니다',
          showConfirmButton: false,
          timer: 777
        }).then((result) => {
          bus.$emit('toJournalForUpdate', this.updatedEvent)
          this.dialog = false
        })
        // bus.$emit('toJournal', 'test')
        // this.dialog = false
      }).catch(() => {})
    },
    deleteJ () {
      // confirm('이 일지를 지우시겠습니까?') && this.deleteJournal(this.journalId)
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
          this.deleteJournal(this.journalId)
          this.$swal(
            '삭제했습니다!',
            '일지가 삭제되었습니다',
            'success'
          )
          bus.$emit('toJournalForDel', this.eventIndex)
          this.dialog = false
        }
      })
      // bus.$emit('toJournal', 'test')
      // this.dialog = false
    }
  }
}
</script>