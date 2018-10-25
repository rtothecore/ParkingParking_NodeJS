<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">작업분류 추가</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md3>
                <v-select
                  v-validate="'required'"
                  :items="bcsItems"
                  v-model="bcs"
                  :error-messages="errors.collect('bcs')"
                  label="대분류"
                  data-vv-name="bcs"
                  required
                  v-on:change="onChangeBcs"
                  item-text="text"
                  item-value="bCode"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-select
                  v-validate="'required'"
                  :items="mcsItems"
                  v-model="mcs"
                  :error-messages="errors.collect('mcs')"
                  label="중분류"
                  data-vv-name="mcs"
                  required
                  v-on:change="onChangeMcs"
                  item-text="text"
                  item-value="mCode"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-select
                  v-validate="'required'"
                  :items="scsItems"
                  v-model="scs"
                  :error-messages="errors.collect('scs')"
                  label="소분류"
                  data-vv-name="scs"
                  required
                  v-on:change="onChangeScs"
                  item-text="text"
                  item-value="sCode"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-text-field 
                  v-validate="'required'"
                  v-model="workType" 
                  :error-messages="errors.collect('workType')"
                  label="작업분류"
                  required
                  data-vv-name="workType">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*필수 입력 사항입니다</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">취소</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">추가</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {bus} from '../main'
import BcService from '@/services/BcService'
import McService from '@/services/McService'
import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      maxWcs: '',
      bcs: '',
      mcs: '',
      scs: '',
      bcsItems: [],
      mcsItems: [],
      scsItems: [],
      dialog: false,
      userId: '5af4fa281a1ee4261039149f',
      workType: '',
      dictionary: {
        custom: {
          bcs: {
            required: '대분류를 선택해주세요'
          },
          mcs: {
            required: '중분류를 선택해주세요'
          },
          scs: {
            required: '소분류를 선택해주세요'
          },
          workType: {
            required: '작업분류를 입력해주세요'
          }
        }
      }
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
    var vm = this
    bus.$on('dialogForAddWorkType', function (value) {
      vm.dialog = true
    })
  },
  created () {
    this.getBCS()
  },
  methods: {
    async getBCS () {
      const response = await BcService.fetchBcs({})
      this.bcsItems = response.data.bcs
    },
    async getMCS (bCode) {
      const response = await McService.fetchMcsByBCode({
        bCode: bCode
      })
      this.mcsItems = response.data.mcs
    },
    async getSCS (bCode, mCode) {
      const response = await ScService.fetchScsByBCodeMCode({
        bCode: bCode,
        mCode: mCode
      })
      this.scsItems = response.data.scs
    },
    async getMaxWCS (bCode, mCode, sCode) {
      const response = await WcService.fetchByBCodeMCodeSCode({
        bCode: bCode,
        mCode: mCode,
        sCode: sCode
      })
      // console.log(response.data[0].wCode)
      this.maxWcs = response.data[0].wCode
    },
    async addWorkType () {
      this.maxWcs = (this.maxWcs.replace('W', '') * 1) + 1
      this.maxWcs = 'W' + this.leadingZeros(this.maxWcs, 3)
      // console.log(this.bcs + ', ' + this.mcs + ', ' + this.scs + ', ' + this.maxWcs + ', ' + this.workType)
      await WcService.createWc({
        bCode: this.bcs,
        mCode: this.mcs,
        sCode: this.scs,
        wCode: this.maxWcs,
        text: this.workType
      })
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
    onChangeBcs: function (event) {
      this.getMCS(event)
    },
    onChangeMcs: function (event) {
      // console.log(this.bcs + ', ' + event)
      this.getSCS(this.bcs, event)
    },
    onChangeScs: function (event) {
      // console.log(this.bcs + ', ' + this.mcs + ', ' + event)
      this.getMaxWCS(this.bcs, this.mcs, event)
    },
    save () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.addWorkType()
        this.$swal({
          type: 'success',
          title: '작업분류를 추가하였습니다',
          showConfirmButton: false,
          timer: 777
        }).then((result) => {
          // bus.$emit('toJournalForNew', this.newEvent)
          this.dialog = false
        })
        // bus.$emit('toJournal', 'test')
        // this.dialog = false
      }).catch(() => {})
    }
  }
}
</script>