<template>
<v-container fluid>
  <v-container grid-list-md text-xs-center fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>공지사항</h1>
      </v-flex>

      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md1 />

      <!--  검색 시작
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
            v-if="setDisable()"
            v-on:keyup="runSearch"></v-text-field>
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
      검색 끝 -->

      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

      <v-dialog v-model="dialog" max-width="500px">
      <v-btn slot="activator" color="primary" dark class="mb-2">새 공지사항</v-btn>
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
                  :error-messages="errors.collect('subject')"
                  data-vv-name="subject"
                  v-model="editedItem.subject" 
                  label="제목" 
                  outline></v-text-field>
              </v-flex> 
              <v-flex xs6 sm6 md12>
                <v-text-field
                  v-validate="'required'"
                  :error-messages="errors.collect('contents')"
                  data-vv-name="contents"
                  v-model="editedItem.contents" 
                  label="내용" 
                  outline></v-text-field>
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
          :items="notices"          
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
            <td class="text-xs-left">{{ props.item.subject }}</td>
            <td class="text-xs-left">{{ props.item.contents }}</td>            
            <td class="text-xs-left">{{ props.item.date }}</td>           
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
    </v-flex>
    <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />
    </v-layout>
  </v-container>
</v-container>
</template>

<script>
import NoticeService from '@/services/NoticeService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      loader: null,
      loading: false,
      pagination: {
        // https://github.com/vuetifyjs/vuetify/issues/442
        sortBy: 'date',
        descending: true
      },
      dialog: false,
      formTitle: '새 공지사항 추가',
      headers: [
        {
          text: '제목',
          align: 'left',
          sortable: false,
          value: 'subject',
          width: '5%'
        },
        { text: '내용', value: 'contents', align: 'left', width: '30%' },
        { text: '일자', value: 'date', align: 'left', width: '5%' },
        { text: '관리', value: 'manage', sortable: false, align: 'left', width: '5%' }
      ],
      editedIndex: -1,
      editedItem: {
        subject: '',
        contents: '',
        date: ''
      },
      notices: [],
      dictionary: {
        custom: {
          subject: {
            required: '제목을 입력해주세요'
          },
          contents: {
            required: '내용을 입력해주세요'
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
    this.getAllNotices()
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
    async getAllNotices () {
      const response = await NoticeService.fetchAllNotices({
      })
      this.notices = response.data
    },
    async updateNotice () {
      await NoticeService.updateNotice({
        id: this.editedItem._id,
        subject: this.editedItem.subject,
        contents: this.editedItem.contents
      })
    },
    async deleteNotice (id) {
      await NoticeService.deleteNotice(id)
    },
    async createNewNotice () {
      await NoticeService.createNewNotice({
        subject: this.editedItem.subject,
        contents: this.editedItem.contents
      })
    },
    editItem (item) {
      this.editedIndex = this.notices.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.formTitle = '공지사항 수정'
    },
    deleteItem (item) {
      const index = this.notices.indexOf(item)
      this.$swal({
        title: '이 공지사항을 삭제 하시겠습니까?',
        text: '삭제 후에 되돌릴 수 없습니다',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소합니다'
      }).then((result) => {
        if (result.value) {
          this.deleteNotice(item._id)
          this.notices.splice(index, 1)
          this.$swal(
            '삭제했습니다!',
            '공지사항이 삭제되었습니다',
            'success'
          )
        }
      })
    },
    close () {
      this.dialog = false
      this.formTitle = '새 공지사항 추가'
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
        if (this.editedIndex > -1) {  // 공지사항 수정
          this.updateNotice()
          this.notices.splice(this.editedIndex, 1)
          this.notices.push(this.editedItem)
        } else {                      // 새 공지사항 추가
          this.createNewNotice()
          this.notices.push(this.editedItem)
        }
        this.editedItem = Object.assign({}, this.defaultItem)
        this.$swal({
          type: 'success',
          title: '공지사항을 저장하였습니다',
          showConfirmButton: false,
          timer: 777
        })
        this.dialog = false
      }).catch(() => {})
    }
  }
}
</script>