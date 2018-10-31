<template>
<v-container fluid>
  <v-container grid-list-md text-xs-center fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>사용자 관리</h1>
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
            label="가입-시작날짜"
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
            label="가입-종료날짜"
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
            v-if="setDisable()"></v-text-field>
        <v-select
          :items="SearchContentLevelItems"
          v-model="e3"
          label="권한 분류"
          class="input-group--focused"
          item-text="text"
          item-value="value"
          v-on:change="onChangeSearchContentLevel"
          v-if="!setDisable()"></v-select>
      </v-flex>

      <v-flex xs8 sm8 md2 class="text-xs-left">
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="light-blue"
          class="white--text"
          @click.native="searchUsers"
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
      <!--  검색 끝 -->

      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

      <v-dialog v-model="dialog" max-width="500px">
      <v-btn slot="activator" color="primary" dark class="mb-2">새 사용자</v-btn>
      <v-card color="white">
        <v-card-title>
          <span class="headline" style="color:black">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs6 sm6 md12>
                <v-text-field
                  v-validate="'required'"
                  :error-messages="errors.collect('name')"
                  data-vv-name="name"
                  v-model="editedItem.name" 
                  label="이름" 
                  outline
                  :disabled="dlgForNew == 0"></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md8>
                <v-text-field
                  v-validate="'required'"
                  :error-messages="errors.collect('email')"
                  data-vv-name="email"
                  v-model="editedItem.email"
                  :rules="emailRules"
                  label="이메일" 
                  outline 
                  :disabled="dlgForNew == 0"></v-text-field>
              </v-flex>
              <v-flex v-if="dlgForNew == 1" xs6 sm6 md4>
                <v-btn outline @click.native="checkEmail">중복체크</v-btn>
              </v-flex>
              <!-- ORIGINAL
              <v-flex v-if="dlgForNew == 1 || dlgLevel == 1" xs6 sm6 md12>
                <v-text-field
                  v-validate="'required'"
                  :error-messages="errors.collect('password')"
                  data-vv-name="password"
                  v-model="editedItem.password" 
                  label="비밀번호(문자, 숫자, 특수기호 조합)" 
                  outline
                  :type="'password'"
                  counter></v-text-field>
              </v-flex>
              <v-flex v-if="dlgForNew == 1 || dlgLevel == 1" xs6 sm6 md12>
                <v-text-field
                  v-validate="'required'"
                  :error-messages="errors.collect('password2')"
                  data-vv-name="password2"
                  v-model="editedItem.password2" 
                  label="비밀번호 확인" 
                  outline
                  :type="'password'"
                  counter></v-text-field>
              </v-flex>
              -->
              <v-flex v-if="dlgForNew == 1" xs6 sm6 md12>
                <v-text-field
                  v-validate="'required'"
                  :error-messages="errors.collect('password')"
                  data-vv-name="password"
                  v-model="editedItem.password" 
                  label="새 비밀번호(문자, 숫자, 특수기호 조합)" 
                  outline
                  :type="'password'"
                  counter></v-text-field>
              </v-flex>
              <v-flex v-else-if="dlgForNew == 0 && dlgLevel == 1" xs6 sm6 md12>
                <v-text-field
                  v-model="editedItem.password" 
                  label="비밀번호(문자, 숫자, 특수기호 조합)" 
                  outline
                  :type="'password'"
                  counter></v-text-field>
              </v-flex>

              <v-flex v-if="dlgForNew == 1" xs6 sm6 md12>
                <v-text-field
                  v-validate="'required'"
                  :error-messages="errors.collect('password2')"
                  data-vv-name="password2"
                  v-model="editedItem.password2" 
                  label="새 비밀번호 확인" 
                  outline
                  :type="'password'"
                  counter></v-text-field>
              </v-flex>
              <v-flex v-else-if="dlgForNew == 0 && dlgLevel == 1" xs6 sm6 md12>
                <v-text-field
                  v-model="editedItem.password2" 
                  label="비밀번호 확인" 
                  outline
                  :type="'password'"
                  counter></v-text-field>
              </v-flex> 

              <v-flex xs6 sm12 md12>
                <v-text-field
                  v-validate="'required'"
                  :error-messages="errors.collect('phoneNo')"
                  data-vv-name="phoneNo"
                  v-model="editedItem.phone_no" 
                  label="휴대폰('-'빼고 입력)" 
                  outline 
                  type="number"></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <v-text-field v-model="editedItem.car_no" label="차번호" outline></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <!-- <v-text-field v-model="editedItem.car_type" label="차종" outline></v-text-field> -->
                <v-select
                  :items="carTypeItems"
                  v-model="editedItem.car_type"
                  label="차종"
                  required
                  v-on:change="onChangeCarType"
                  item-text="carTypeName"
                  item-value="carTypeValue"
                  solo
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <!--
                <v-text-field
                  v-validate="'required'"
                  :error-messages="errors.collect('level')"
                  data-vv-name="level"
                  v-model="editedItem.level" 
                  label="권한" 
                  outline></v-text-field>
                -->
                <v-select
                  v-validate="'required'"
                  :items="levelItems"
                  v-model="editedItem.level"
                  :error-messages="errors.collect('level')"
                  label="권한"
                  data-vv-name="level"
                  required
                  v-on:change="onChangeLevel"
                  item-text="levelName"
                  item-value="levelValue"
                  solo
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outline color="black" flat @click.native="save">저장</v-btn>
          <v-btn outline color="black" flat @click.native="close">닫기</v-btn>
        </v-card-actions>
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
          :items="users"
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
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">{{ props.item.phone_no }}</td>
            <td class="text-xs-left">{{ props.item.car_no }}</td>
            <td class="text-xs-left">{{ props.item.car_typeValue }}</td>
            <td class="text-xs-left">{{ props.item.levelValue }}</td>
            <td class="text-xs-left">{{ props.item.join_date }}</td>           
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="leaveItem(props.item)">
                <v-icon color="red">time_to_leave</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
    </v-flex>
    <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />
    </v-layout>
  </v-container>
</v-container>
</template>

<script>
import UserService from '@/services/UserService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      SearchContentLevelItems: [
          { text: '최고관리자', value: '1' },
          { text: '데이터관리자', value: '10' },
          { text: '일반사용자', value: '99' }
      ],
      e3: null,
      searchContentDisabled: true,
      searchContent: null,
      selectedSearchType: null,
      e2: null,
      SearchTypeItems: [
          { text: '이름', value: 'byName' },
          { text: '이메일', value: 'byEmail' },
          { text: '휴대폰', value: 'byPhone' },
          { text: '권한', value: 'byLevel' }
      ],
      menu: false,
      menu2: false,
      startDate: null,
      endDate: null,
      carTypeItems: [{'carTypeName': '소형', 'carTypeValue': '1'}, {'carTypeName': '중형', 'carTypeValue': '2'}, {'carTypeName': '대형', 'carTypeValue': '3'}],
      levelItems: [{'levelName': '최고관리자', 'levelValue': '1'}, {'levelName': '데이터관리자', 'levelValue': '10'}, {'levelName': '일반사용자', 'levelValue': '99'}],
      show1: false,
      isValidEmail: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || '부적합한 E-mail 형식입니다'
      ],
      dlgLevel: 1,
      dlgForNew: 1,
      search: null,
      loader: null,
      loading: false,
      pagination: {
        // https://github.com/vuetifyjs/vuetify/issues/442
        sortBy: 'date',
        descending: true
      },
      dialog: false,
      formTitle: '새 사용자 추가',
      headers: [
        {
          text: '이름',
          align: 'left',
          sortable: false,
          value: 'name',
          width: '5%'
        },
        { text: '이메일', value: 'email', align: 'left', width: '5%' },
        { text: '휴대폰', value: 'phone_no', align: 'left', width: '5%' },
        { text: '차번호', value: 'car_no', align: 'left', width: '5%' },
        { text: '차종', value: 'car_type', align: 'left', width: '5%' },
        { text: '권한', value: 'level', align: 'left', width: '5%' },
        { text: '가입날짜', value: 'join_date', align: 'left', width: '5%' },
        { text: '관리', value: 'manage', sortable: false, align: 'left', width: '5%' }
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        email: '',
        password: '',
        password2: '',
        phone_no: '',
        car_no: '',
        car_type: '',
        car_typeValue: '',
        level: '',
        levelValue: ''
      },
      users: [],
      dictionary: {
        custom: {
          /*
          startDate: {
            required: '검색 시작날짜를 입력해주세요'
          },
          endDate: {
            required: '검색 종료날짜를 입력해주세요'
          },
          */
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
    this.getAllUsers()
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
    async getAllUsers () {
      const response = await UserService.fetchAllUser({
      })
      this.users = response.data
      for (var i = 0; i < this.users.length; i++) {
        switch (this.users[i].car_type) {
          case '1' :
            this.users[i].car_typeValue = '소형'
            break
          case '2' :
            this.users[i].car_typeValue = '중형'
            break
          case '3' :
            this.users[i].car_typeValue = '대형'
            break
          default :
            break
        }
      }
      for (i = 0; i < this.users.length; i++) {
        switch (this.users[i].level) {
          case '1' :
            this.users[i].levelValue = '최고관리자'
            break
          case '10' :
            this.users[i].levelValue = '데이터관리자'
            break
          case '99' :
            this.users[i].levelValue = '일반사용자'
            break
          default :
            break
        }
      }
    },
    async updateUser () {
      await UserService.updateUser({
        id: this.editedItem._id,
        name: this.editedItem.name,
        email: this.editedItem.email,
        password: this.editedItem.password,
        phone_no: this.editedItem.phone_no,
        car_no: this.editedItem.car_no,
        car_type: this.editedItem.car_type,
        level: this.editedItem.level
      })
    },
    async deleteUser (id) {
      await UserService.deleteUser(id)
    },
    async leaveUser (id) {
      await UserService.leaveUser(id)
    },
    async createNewUser () {
      await UserService.createNewUser({
        name: this.editedItem.name,
        email: this.editedItem.email,
        password: this.editedItem.password,
        phone_no: this.editedItem.phone_no,
        car_no: this.editedItem.car_no,
        car_type: this.editedItem.car_type,
        level: this.editedItem.level
      })
    },
    async checkDuplicatedEmail (email) {
      const response = await UserService.checkDupllicatedUserEmail(email)
      if (response.data.length === 0) {
        this.$swal(
          '사용 가능한 이메일입니다',
          '유효한 이메일이 확인되었습니다',
          'success'
        )
        this.isValidEmail = true
      } else {
        this.$swal(
          '이미 존재하는 이메일입니다',
          '같은 주소의 이메일이 확인되었습니다',
          'error'
        )
        this.editedItem.email = ''
        this.isValidEmail = false
      }
    },
    async getUsersBy4 () {
      /*
      if (!this.startDate) {
        this.startDate = 0
      }
      if (!this.endDate) {
        this.endDate = 0
      }
      */
      var tmpSearchType = this.selectedSearchType
      if (!tmpSearchType) {
        tmpSearchType = 0
      }
      var tmpSearchContent = this.searchContent
      if (!tmpSearchContent) {
        tmpSearchContent = 0
      }
      const response = await UserService.fetchUsersBy4({
        startDate: this.startDate,
        endDate: this.endDate,
        searchType: tmpSearchType,
        searchContent: tmpSearchContent
      })
      this.users = response.data
      for (var i = 0; i < this.users.length; i++) {
        switch (this.users[i].car_type) {
          case '1' :
            this.users[i].car_typeValue = '소형'
            break
          case '2' :
            this.users[i].car_typeValue = '중형'
            break
          case '3' :
            this.users[i].car_typeValue = '대형'
            break
          default :
            break
        }
      }
      for (i = 0; i < this.users.length; i++) {
        switch (this.users[i].level) {
          case '1' :
            this.users[i].levelValue = '최고관리자'
            break
          case '10' :
            this.users[i].levelValue = '데이터관리자'
            break
          case '99' :
            this.users[i].levelValue = '일반사용자'
            break
          default :
            break
        }
      }
    },
    checkEmail () {
      // this.$validator.validateAll().then((result) => {
      // https://jsfiddle.net/pp0w8u6s/
      this.$validator.validate('email', this.editedItem.email).then((result) => {
        if (!result) {
          return
        }
        this.checkDuplicatedEmail(this.editedItem.email)
      }).catch(() => {})
    },
    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      // console.log(item)
      this.editedItem.level = this.users[this.editedIndex].level
      if (this.users[this.editedIndex].level === '99') {  // 권한 레벨 99인 일반사용자의 경우 비번수정이 불가능
        this.dlgLevel = 0
      } else {      // 권한 레벨 1, 10일 경우 비번수정 가능
        this.dlgLevel = 1
        this.editedItem.password = '' // 기본적으로 비번 입력칸을 공백으로 두어 비번입력을 해야 수정 가능하도록 함
        this.editedItem.password2 = ''
      }
      this.dialog = true
      this.formTitle = '사용자 수정 - ' + this.users[this.editedIndex].name
      this.dlgForNew = 0
    },
    deleteItem (item) {
      const index = this.users.indexOf(item)
      this.$swal({
        title: '이 사용자를 삭제 하시겠습니까?',
        text: '삭제 후에 되돌릴 수 없습니다',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소합니다'
      }).then((result) => {
        if (result.value) {
          this.deleteUser(item._id)
          this.users.splice(index, 1)
          this.$swal(
            '삭제했습니다!',
            '사용자가 삭제되었습니다',
            'success'
          )
        }
      })
    },
    leaveItem (item) {
      const index = this.users.indexOf(item)
      this.$swal({
        title: '이 사용자를 탈퇴 시키겠습니까?',
        text: '탈퇴 후에 되돌릴 수 없습니다',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 탈퇴시킵니다',
        cancelButtonText: '취소합니다'
      }).then((result) => {
        if (result.value) {
          this.leaveUser(item._id)
          this.users.splice(index, 1)
          this.$swal(
            '탈퇴 시켰습니다!',
            '사용자가 탈퇴되었습니다',
            'success'
          )
        }
      })
    },
    close () {
      this.dialog = false
      this.formTitle = '새 사용자 추가'
      this.dlgForNew = 1
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        // DB Insert
        if (this.editedIndex > -1) {  // 사용자 수정
          if (this.dlgLevel === 1) {  // 권한레벨이 99가 아닌 1, 10인 경우
            if (this.editedItem.password === '') {  // 비밀번호 입력하지 않은 경우 유효성검사를 하지 않는다.
            } else {  // 비밀번호를 입력한 경우 유효성 검사를 한다.
              // 비밀번호 유효성 검사
              if (!this.validatePassword(this.editedItem.password)) {
                this.$swal(
                  '유효한 암호를 입력해주세요',
                  '문자 + 숫자 + 특수기호 조합 최소6자리',
                  'error'
                )
                return
              }
              // 비밀번호 재확인 검사
              if (this.editedItem.password !== this.editedItem.password2) {
                this.$swal(
                  '동일한 암호를 입력해주세요',
                  '문자 + 숫자 + 특수기호 조합 최소6자리',
                  'error'
                )
                return
              }
            }
          } else {    // 권한레벨이 99인 경우 비밀번호 수정을 못하도록 한다
            this.editedItem.password = ''
          }
          this.updateUser()
          this.users.splice(this.editedIndex, 1)
          this.users.push(this.editedItem)
        } else {                      // 새 사용자 추가
          // 이메일 유효성 검사
          if (!this.isValidEmail) {
            this.$swal(
              '이메일 중복체크를 해주세요',
              '이메일 중복체크가 안되었습니다',
              'error'
            )
            return
          }
          // 비밀번호 유효성 검사
          if (!this.validatePassword(this.editedItem.password)) {
            this.$swal(
              '유효한 암호를 입력해주세요',
              '문자 + 숫자 + 특수기호 조합 최소6자리',
              'error'
            )
            return
          }
          // 비밀번호 재확인 검사
          if (this.editedItem.password !== this.editedItem.password2) {
            this.$swal(
              '동일한 암호를 입력해주세요',
              '문자 + 숫자 + 특수기호 조합 최소6자리',
              'error'
            )
            return
          }
          this.createNewUser()
          this.users.push(this.editedItem)
        }
        this.editedItem = Object.assign({}, this.defaultItem)
        this.$swal({
          type: 'success',
          title: '사용자를 저장하였습니다',
          showConfirmButton: false,
          timer: 777
        })
        this.dialog = false
      }).catch(() => {})
    },
    // http://frontend.diffthink.kr/2018/02/blog-post.html
    validatePassword (character) {
      return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/.test(character)
    },
    onChangeLevel: function (event) {
      // console.log(event)
      this.editedItem.level = event
      // this.selectedLandId = event
      // this.getCropCodeByLandId(this.selectedLandId)
    },
    onChangeCarType: function (event) {
      this.editedItem.car_type = event
    },
    onChangeSearchType: function (event) {
      this.selectedSearchType = event
      if (event === 'byLevel') {
        this.searchContentDisabled = false
      } else {
        this.searchContentDisabled = true
      }
    },
    onChangeSearchContentLevel: function (event) {
      // console.log(event)
      this.searchContent = event
    },
    searchUsers () {
      this.loader = 'loading'
      this.getUsersBy4()
      /*
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.getJournalsBy4()
      }).catch(() => {})
      */
    },
    searchReset () {
      this.startDate = ''
      this.endDate = ''
      this.e2 = null
      this.searchContent = ''
      this.searchContentDisabled = true
      this.getAllUsers()
      this.$validator.reset()
    },
    setDisable () {
      return this.searchContentDisabled
    }
  }
}
</script>