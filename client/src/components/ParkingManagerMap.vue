<template>
<v-container fluid>
  <v-container grid-list-md text-xs-center fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>주차장 관리</h1>
      </v-flex>

      <v-flex xs6 sm6 md4/>

      <v-flex xs6 sm6 md2>        
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
        ></v-select>
      </v-flex>

      <v-flex xs4 sm4 md2>
        <v-text-field
            v-model="searchContent"
            label="주차장명"
            required
            outline             
            v-on:keyup="runSearch"></v-text-field>        
      </v-flex>

      <v-flex xs8 sm8 md3 class="text-xs-left">
        <v-btn          
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
      </v-flex>
      
      <v-flex xs12 class="text-xs-center" mt-1>        
        <vue-daum-map
          :appKey="appKey"
          :center.sync="center"
          :level.sync="level"
          :mapTypeId="mapTypeId"
          :libraries="libraries"
          @load="onLoad"

          @center_changed="onMapEvent('center_changed', $event)"
          @zoom_start="onMapEvent('zoom_start', $event)"
          @zoom_changed="onMapEvent('zoom_changed', $event)"
          @bounds_changed="onMapEvent('bounds_changed', $event)"
          @click="onMapEvent('click', $event)"
          @dblclick="onMapEvent('dblclick', $event)"
          @rightclick="onMapEvent('rightclick', $event)"
          @mousemove="onMapEvent('mousemove', $event)"
          @dragstart="onMapEvent('dragstart', $event)"
          @drag="onMapEvent('drag', $event)"
          @dragend="onMapEvent('dragend', $event)"
          @idle="onMapEvent('idle', $event)"
          @tilesloaded="onMapEvent('tilesloaded', $event)"
          @maptypeid_changed="onMapEvent('maptypeid_changed', $event)"

          style="width:1850px;height:750px;">
        </vue-daum-map>

        <h2>Options</h2>
        <table>
          <colgroup>
            <col width="60" />
            <col />
          </colgroup>
          <tr>
            <th>레벨</th>
            <td><input type="range" min="1" max="14" v-model.number="level"> {{level}}</td>
          </tr>
          <tr>
            <th>경도</th>
            <td><input type="number" v-model.number="center.lat" step="0.0001"></td>
          </tr>
          <tr>
            <th>위도</th>
            <td><input type="number" v-model.number="center.lng" step="0.0001"></td>
          </tr>
        </table>
      </v-flex>
      
    </v-layout>

    <div>
      <parkingManagerMapDetail></parkingManagerMapDetail>      
    </div>

  </v-container>
</v-container>
</template>

<script>
import {bus} from '../main'
import ParkingService from '@/services/ParkingService'
import VueDaumMap from 'vue-daum-map'
export default {
  components: {VueDaumMap: VueDaumMap},
  data () {
    return {
      displayValue: 2,
      markers: [],
      isSetCenter: 0,
      dialog: false,
      appKey: '58343c64a8d8186ec025571087316836',
      center: {lat: 33.4577073003335, lng: 126.58962232346863},
      level: 8,
      mapTypeId: VueDaumMap.MapTypeId.NORMAL,
      libraries: [],
      mapObject: null,
      parkings: [],
      searchContent: null,
      displays: [
        { name: '전체', value: 2 },
        { name: '공개', value: 1 },
        { name: '비공개', value: 0 }
      ]
    }
  },
  mounted () {
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
  },
  computed: {
  },
  methods: {
    async getAllParkings () {
      const response = await ParkingService.fetchAllParking({
      })
      this.parkings = response.data
      this.displayMarkers(this.parkings)
    },
    async getParkingsBy2 () {
      var tmpSearchContent = this.searchContent
      if (!tmpSearchContent) {
        tmpSearchContent = 0
      }
      const response = await ParkingService.fetchParkingsBy2({
        display: this.displayValue,
        searchContent: tmpSearchContent
      })
      this.parkings = response.data
      this.displayMarkers(this.parkings)
    },
    displayMarkers (parkingsVal) {
      this.hideMarkers()
      for (var i = 0; i < parkingsVal.length; i++) {
        let daummaps = window.daum.maps
        this.addMarker(new daummaps.LatLng(parkingsVal[i].lat, parkingsVal[i].lng), parkingsVal[i])
      }
      this.showMarkers()
    },
    onLoad (map) {
      this.mapObject = map
    },
    onMapEvent (event, params) {
      // console.log(`Daum Map Event(${event})`, params)
      this.mapObject.relayout()

      if (this.isSetCenter < 3) {
        let daummaps = window.daum.maps
        this.mapObject.setCenter(new daummaps.LatLng(this.center.lat, this.center.lng))
        this.isSetCenter++
      }
    },
    addMarker (position, parkingData) {
      let daummaps = window.daum.maps
      var marker = new daummaps.Marker({
        position: position,
        clickable: true
      })
      marker.setMap(this.mapObject)
      this.markers.push(marker)

      var vm = this
      // 마커 클릭 이벤트 - http://apis.map.daum.net/web/sample/addMarkerClickEvent/
      daummaps.event.addListener(marker, 'click', function () {
        vm.mapObject.setCenter(position)  // 클릭시 해당 마커를 중앙으로 정렬
        bus.$emit('dialogForDetail', parkingData)
      })
    },
    setMarkers (map) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(map)
      }
    },
    showMarkers () {
      this.setMarkers(this.mapObject)
    },
    hideMarkers () {
      this.setMarkers(null)
      this.markers = []
    },
    onChangeDisplay: function (event) {
      switch (event) {
        case 2 :
          this.displayValue = '2'
          break
        case 1 :
          this.displayValue = '1'
          break
        case 0 :
          this.displayValue = '0'
          break
        default :
          break
      }
    },
    runSearch: function (e) {
      if (e.keyCode === 13) {
        this.searchParkings()
      }
    },
    searchParkings () {
      this.getParkingsBy2()
    },
    searchReset () {
      this.searchContent = ''
      this.getAllParkings()
    }
  }
}
</script>