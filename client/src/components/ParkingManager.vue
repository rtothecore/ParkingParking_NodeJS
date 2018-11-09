<template>
<v-container fluid>
  <v-container grid-list-md text-xs-center fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>주차장 관리</h1>
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
            label="데이터입력-시작날짜"
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
            label="데이터입력-종료날짜"
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
            v-on:keyup="runSearch"></v-text-field>        
      </v-flex>

      <v-flex xs8 sm8 md3 class="text-xs-left">
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="light-blue"
          class="white--text"
          @click.native="searchParkings"
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
        <v-btn color="success" @click.native="downloadExcelFormFile">엑셀 폼</v-btn>
        <v-btn color="success" @click.native="createExcelDlg">엑셀 수정</v-btn>
      </v-flex>
      <!-- 검색 끝 -->

      <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />

      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">        
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click.native="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="saveParking">저장</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-list three-line subheader>
            <v-subheader>기본정보</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>구분</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.division }} -->
                  <v-text-field                  
                  v-model="editedItem.division"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>유형</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.type }} -->
                  <v-text-field                  
                  v-model="editedItem.type"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>도로명주소</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.addr_road }} -->
                  <v-text-field                  
                  v-model="editedItem.addr_road"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>지번주소</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.addr_jibun }} -->
                  <v-text-field                  
                  v-model="editedItem.addr_jibun"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>주차구획수</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.total_p }} -->
                  <v-text-field                  
                  v-model="editedItem.total_p"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>급지구분</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.feed }} -->
                  <v-text-field                  
                  v-model="editedItem.feed"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>부제시행</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.buje }} -->
                  <v-text-field                  
                  v-model="editedItem.buje"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>운영일</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.op_date }} -->
                  <v-text-field                  
                  v-model="editedItem.op_date"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>            
          </v-list>
          <v-divider></v-divider>

          <v-list three-line subheader>
            <v-subheader>주차장 운영시간</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>평일운영 시작시간</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.w_op.start_time }} -->
                  <v-text-field                  
                  v-model="editedItem.w_op.start_time"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>평일운영 종료시간</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.w_op.end_time }} -->
                  <v-text-field                  
                  v-model="editedItem.w_op.end_time"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>토요일운영 시작시간</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.s_op.start_time }} -->
                  <v-text-field                  
                  v-model="editedItem.s_op.start_time"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>토요일운영 종료시간</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.s_op.end_time }} -->
                  <v-text-field                  
                  v-model="editedItem.s_op.end_time"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>공휴일운영 시작시간</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.h_op.start_time }} -->
                  <v-text-field                  
                  v-model="editedItem.h_op.start_time"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>              
              <v-list-tile-content>
                <v-list-tile-title>공휴일운영 종료시간</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.h_op.end_time }} -->
                  <v-text-field                  
                  v-model="editedItem.h_op.end_time"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>            
          </v-list>
          <v-divider></v-divider>

          <v-list three-line subheader>
            <v-subheader>주차장 요금정보</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>요금정보</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.fee_info }} -->
                  <v-text-field                  
                  v-model="editedItem.fee_info"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>기본 시간</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.park_base.time }}분 -->
                  <v-text-field                  
                  v-model="editedItem.park_base.time"
                  label="분"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>기본 요금</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.park_base.fee }}원 -->
                  <v-text-field                  
                  v-model="editedItem.park_base.fee"   
                  label="원"                
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>추가 시간</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.add_term.time }}분 -->
                  <v-text-field                  
                  v-model="editedItem.add_term.time"  
                  label="분"                                 
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>추가 요금</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.add_term.fee }}원 -->
                  <v-text-field                  
                  v-model="editedItem.add_term.fee"
                  label="원"                                  
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>    
              <v-list-tile-content>
                <v-list-tile-title>1일 주차권 시간</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.one_day_park.time }}일 -->
                  <v-text-field                  
                  v-model="editedItem.one_day_park.time"
                  label="일"                                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>1일 주차권 요금</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.one_day_park.fee }}원 -->
                  <v-text-field                  
                  v-model="editedItem.one_day_park.fee"
                  label="원"                                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>월 정기권 요금</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.month_fee }}원 -->
                  <v-text-field                  
                  v-model="editedItem.month_fee" 
                  label="원"                                  
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>결제방법</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.payment }} -->
                  <v-text-field                  
                  v-model="editedItem.payment"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>                           
            </v-list-tile>            
          </v-list>
          <v-divider></v-divider>

          <v-list three-line subheader>
            <v-subheader>주차장 기타정보</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>특기사항</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.remarks }} -->
                  <v-text-field                  
                  v-model="editedItem.remarks"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>관리기관명</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.manager }} -->
                  <v-text-field                  
                  v-model="editedItem.manager"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>전화번호</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.tel }} -->
                  <v-text-field                  
                  v-model="editedItem.tel"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>  
              <v-list-tile-content>
                <v-list-tile-title>GPS 위도</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.lat }} -->
                  <v-text-field                  
                  v-model="editedItem.lat"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>GPS 경도</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.lng }} -->
                  <v-text-field                  
                  v-model="editedItem.lng"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>홈페이지</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.homepage }} -->
                  <v-text-field                  
                  v-model="editedItem.homepage"                   
                  outline>
                  </v-text-field>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>소형</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.park_space_count.small }} -->
                  <v-text-field                  
                  v-model="editedItem.park_space_count.small"                   
                  outline>
                  </v-text-field>                                         
                </v-list-tile-sub-title>                
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>중형</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.park_space_count.mid }} -->
                  <v-text-field                  
                  v-model="editedItem.park_space_count.mid"                   
                  outline> 
                  </v-text-field>                                        
                </v-list-tile-sub-title>                
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>대형</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.park_space_count.big }} -->
                  <v-text-field                  
                  v-model="editedItem.park_space_count.big"                   
                  outline>
                  </v-text-field>  
                </v-list-tile-sub-title>                
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>전기</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.park_space_count.elec }} -->                  
                  <v-text-field                  
                  v-model="editedItem.park_space_count.elec"                   
                  outline>
                  </v-text-field>  
                </v-list-tile-sub-title>                
              </v-list-tile-content>
              <v-list-tile-content>
                <v-list-tile-title>장애</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.park_space_count.hand }} -->
                  <v-text-field                  
                  v-model="editedItem.park_space_count.hand"                   
                  outline>
                  </v-text-field>  
                </v-list-tile-sub-title>                
              </v-list-tile-content>                           
              <v-list-tile-content>
                <v-list-tile-title>할인정보</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.sale_info }} -->
                  <v-text-field                  
                  v-model="editedItem.sale_info"                   
                  outline>
                  </v-text-field> 
                </v-list-tile-sub-title>
              </v-list-tile-content>                           
            </v-list-tile>            
          </v-list>
          <v-divider></v-divider>

          <v-list three-line subheader>
            <v-subheader>주차장 공개여부</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>공개여부</v-list-tile-title>
                <v-list-tile-sub-title>
                  <!-- {{ editedItem.sale_info }} -->
                  <v-text-field                  
                  v-model="editedItem.display"
                  label="공개/비공개"                   
                  outline>
                  </v-text-field> 
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
          :items="parkings"
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
            <td class="text-xs-left">{{ props.item.no }}</td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.addr_road }}</td>
            <td class="text-xs-left">{{ props.item.op_date }}</td>
            <td class="text-xs-left">{{ props.item.park_base.fee }}</td>
            <td class="text-xs-left">{{ props.item.add_term.fee }}</td>
            <td class="text-xs-left">{{ props.item.data_date }}</td>
            <td class="text-xs-left">{{ getDisplayValue(props.item.display) }}</td>
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
          <v-pagination v-model="pagination.page" :length="pages" :total-visible="7"></v-pagination>
        </div>        
    </v-flex>
    <v-flex v-if="$mq === 'laptop' || $mq === 'desktop'" md2 />
    </v-layout>

    <div>
      <parkingExcel></parkingExcel>      
    </div>

  </v-container>
</v-container>
</template>

<script>
import {bus} from '../main'
import ParkingService from '@/services/ParkingService'
import axios from 'axios'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      formTitle: '',
      e3: null,
      searchContentDisabled: true,
      searchContent: null,
      selectedSearchType: null,
      e2: null,
      SearchTypeItems: [
          { text: '일련번호', value: 'byNo' },
          { text: '주차장명', value: 'byParkingName' },
          { text: '주소', value: 'byAddress' }
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
        descending: true,
        rowsPerPage: 10
      },
      dialog: false,
      headers: [
        {
          text: '일련번호',
          align: 'left',
          sortable: false,
          value: 'no',
          width: '5%'
        },
        { text: '주차장명', value: 'name', align: 'left', width: '5%' },
        { text: '주소', value: 'addr_road', align: 'left', width: '15%' },
        { text: '운영일', value: 'op_date', align: 'left', width: '10%' },
        { text: '기본요금', value: 'park_base', align: 'left', width: '5%' },
        { text: '추가요금', value: 'add_term', align: 'left', width: '5%' },
        { text: '데이터일자', value: 'data_date', align: 'left', width: '5%' },
        { text: '공개여부', value: 'display', align: 'left', width: '5%' },
        { text: '관리', value: 'manage', sortable: false, align: 'left', width: '5%' }
      ],
      editedIndex: -1,
      editedItem: {
        no: '',
        name: '',
        division: '',
        type: '',
        addr_road: '',
        addr_jibun: '',
        total_p: '',
        feed: '',
        buje: '',
        op_date: '',
        w_op: '',
        s_op: '',
        h_op: '',
        fee_info: '',
        park_base: '',
        add_term: '',
        one_day_park: '',
        month_fee: '',
        payment: '',
        remarks: '',
        manager: '',
        tel: '',
        lat: '',
        lng: '',
        data_date: '',
        homepage: '',
        park_space_count: '',
        sale_info: '',
        display: ''
      },
      parkings: []
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
    this.getAllParkings()
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
    async getAllParkings () {
      const response = await ParkingService.fetchAllParking({
      })
      this.parkings = response.data
    },
    async getParkingsBy4 () {
      var tmpSearchType = this.selectedSearchType
      if (!tmpSearchType) {
        tmpSearchType = 0
      }
      var tmpSearchContent = this.searchContent
      if (!tmpSearchContent) {
        tmpSearchContent = 0
      }
      const response = await ParkingService.fetchParkingsBy4({
        startDate: this.startDate,
        endDate: this.endDate,
        searchType: tmpSearchType,
        searchContent: tmpSearchContent
      })
      this.parkings = response.data
    },
    async deleteParking (id) {
      await ParkingService.deleteParking(id)
    },
    async updateParking () {
      await ParkingService.updateParking({
        id: this.editedItem._id,
        name: this.editedItem.name,
        division: this.editedItem.division,
        type: this.editedItem.type,
        addr_road: this.editedItem.addr_road,
        addr_jibun: this.editedItem.addr_jibun,
        total_p: this.editedItem.total_p,
        feed: this.editedItem.feed,
        buje: this.editedItem.buje,
        op_date: this.editedItem.op_date,
        w_op: this.editedItem.w_op,
        s_op: this.editedItem.s_op,
        h_op: this.editedItem.h_op,
        fee_info: this.editedItem.fee_info,
        park_base: this.editedItem.park_base,
        add_term: this.editedItem.add_term,
        one_day_park: this.editedItem.one_day_park,
        month_fee: this.editedItem.month_fee,
        payment: this.editedItem.payment,
        remarks: this.editedItem.remarks,
        manager: this.editedItem.manager,
        tel: this.editedItem.tel,
        lat: this.editedItem.lat,
        lng: this.editedItem.lng,
        data_date: this.editedItem.data_date,
        homepage: this.editedItem.homepage,
        park_space_count: this.editedItem.park_space_count,
        sale_info: this.editedItem.sale_info,
        display: this.editedItem.display
      })
    },
    onChangeSearchType: function (event) {
      this.selectedSearchType = event
    },
    runSearch: function (e) {
      if (e.keyCode === 13) {
        this.searchParkings()
      }
    },
    searchParkings () {
      this.loader = 'loading'
      this.getParkingsBy4()
    },
    searchReset () {
      this.startDate = ''
      this.endDate = ''
      this.e2 = null
      this.searchContent = ''
      this.getAllParkings()
    },
    editItem (item) {
      this.editedIndex = this.parkings.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.formTitle = this.parkings[this.editedIndex].name + '(' + this.parkings[this.editedIndex].no + ')'
    },
    deleteItem (item) {
      const index = this.parkings.indexOf(item)
      this.$swal({
        title: '이 주차장을 삭제 하시겠습니까?',
        text: '삭제 후에 되돌릴 수 없습니다',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소합니다'
      }).then((result) => {
        if (result.value) {
          this.deleteParking(item._id)
          this.parkings.splice(index, 1)
          this.$swal(
            '삭제했습니다!',
            '주차장을 삭제했습니다.',
            'success'
          )
        }
      })
    },
    createExcelDlg () {
      bus.$emit('dialogForExcel', this.parkings)
    },
    saveParking () {
      this.updateParking()
      this.$swal(
          '저장하였습니다.',
          '주차장 정보를 수정하였습니다',
          'success'
        )
    },
    getExcelFormFile () {
      // https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
      axios({
        url: 'http://192.168.0.73:9081/getExcel/parkingDataForm.xlsx',
        method: 'GET',
        responseType: 'blob' // important
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'parkingDataForm.xlsx')
        document.body.appendChild(link)
        link.click()
      })
    },
    downloadExcelFormFile () {
      this.getExcelFormFile()
    },
    getDisplayValue (displayVal) {
      if (displayVal === '0') {
        return '비공개'
      } else if (displayVal === '1') {
        return '공개'
      } else {
        return '설정안됨'
      }
    }
  }
}
</script>