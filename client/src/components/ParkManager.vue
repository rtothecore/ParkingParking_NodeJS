<template>
<v-container fluid>
  <v-container grid-list-md text-xs-center fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>주차장 관리</h1>
      </v-flex>

      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

      <!--
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
      -->

      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

      <v-dialog v-model="dialog" max-width="500px">
      <v-btn slot="activator" color="primary" dark class="mb-2">새 사용자</v-btn>
      <v-card color="teal">
        <v-card-title>
          <span class="headline" style="color:white">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs6 sm6 md12>
                <v-text-field v-model="editedItem.name" label="이름" solo></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md12>
                <v-text-field v-model="editedItem.email" label="이메일" solo></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md12>
                <v-text-field v-model="editedItem.password" label="비밀번호" solo></v-text-field>
              </v-flex>
              <v-flex xs6 sm12 md12>
                <v-text-field v-model="editedItem.phone_no" label="휴대폰" solo></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <v-text-field v-model="editedItem.car_no" label="차번호" solo></v-text-field>
              </v-flex>
              <v-flex xs6 sm6 md6>
                <v-text-field v-model="editedItem.car_type" label="차종" solo></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="editedItem.level" label="권한" solo></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outline color="white" flat @click.native="save">저장</v-btn>
          <v-btn outline color="white" flat @click.native="close">닫기</v-btn>
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
            <td class="text-xs-left">{{ props.item.password }}</td>
            <td class="text-xs-left">{{ props.item.phone_no }}</td>
            <td class="text-xs-left">{{ props.item.car_no }}</td>
            <td class="text-xs-left">{{ props.item.car_type }}</td>
            <td class="text-xs-left">{{ props.item.level }}</td>
            <td class="text-xs-left">{{ props.item.tmp_pw_date }}</td>
            <td class="text-xs-left">{{ props.item.join_date }}</td>
            <td class="text-xs-left">{{ props.item.mod_date }}</td>
            <td class="text-xs-left">{{ props.item.pw_date }}</td>            
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
          text: '이름',
          align: 'left',
          sortable: false,
          value: 'name',
          width: '5%'
        },
        { text: '이메일', value: 'email', align: 'left', width: '5%' },
        { text: '비밀번호', value: 'password', align: 'left', width: '5%' },
        { text: '휴대폰', value: 'phone_no', align: 'left', width: '5%' },
        { text: '차번호', value: 'car_no', align: 'left', width: '5%' },
        { text: '차종', value: 'car_type', align: 'left', width: '5%' },
        { text: '권한', value: 'level', align: 'left', width: '5%' },
        { text: '임시비번발급날짜', value: 'tmp_pw_date', align: 'left', width: '5%' },
        { text: '가입날짜', value: 'join_date', align: 'left', width: '5%' },
        { text: '수정날짜', value: 'mod_date', align: 'left', width: '5%' },
        { text: '비번생성날짜', value: 'pw_date', align: 'left', width: '5%' },
        { text: '관리', value: 'manage', sortable: false, align: 'left', width: '5%' }
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        email: '',
        password: '',
        phone_no: '',
        car_no: '',
        car_type: '',
        level: ''
      },
      users: [],
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
        car_type: this.editedItem.car_type
      })
    },
    editItem (item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.formTitle = '사용자 수정 - ' + this.users[this.editedIndex].name
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
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) {
        this.updateUser()
        this.users.splice(this.editedIndex, 1)
        this.users.push(this.editedItem)
      } else {
        this.createNewUser()
        this.users.push(this.editedItem)
      }
      this.editedItem = Object.assign({}, this.defaultItem)
      this.$swal({
        type: 'success',
        title: '일지를 저장하였습니다',
        showConfirmButton: false,
        timer: 777
      })
      this.dialog = false
    }
  }
}
</script>