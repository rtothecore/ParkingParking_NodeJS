<template>
<v-container fluid>
  <v-container grid-list-md text-xs-center fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>주차장 관리</h1>
      </v-flex>

      <v-flex xs6 sm6 md4/>

      <v-flex xs6 sm6 md2>        
        <v-switch :label="`공개여부: ${switch1.toString()}`" v-model="switch1" @click="switchDisplay"></v-switch>        
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
      markers: [],
      isSetCenter: 0,
      dialog: false,
      appKey: '18224044621f2ce03db4a65d7418f518',
      center: {lat: 33.4577073003335, lng: 126.58962232346863},
      level: 8,
      mapTypeId: VueDaumMap.MapTypeId.NORMAL,
      libraries: [],
      mapObject: null,
      parkings: [],
      switch1: false,
      searchContent: null
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
    async getParkingsWithDisplay (displayVal) {
      const response = await ParkingService.fetchParkingWithDisplay({
        display: displayVal
      })
      this.parkings = response.data
      this.displayMarkers(this.parkings)
    },
    async getParkingsBy4 () {
      var tmpSearchType = 'byParkingName'
      var tmpSearchContent = this.searchContent
      if (!tmpSearchContent) {
        tmpSearchContent = 0
      }
      const response = await ParkingService.fetchParkingsBy4({
        searchType: tmpSearchType,
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
    switchDisplay () {
      if (this.switch1) { // true => false
        this.getParkingsWithDisplay('0')
      } else {            // false => true
        this.getParkingsWithDisplay('1')
      }
    },
    runSearch: function (e) {
      if (e.keyCode === 13) {
        this.searchParkings()
      }
    },
    searchParkings () {
      this.getParkingsBy4()
    },
    searchReset () {
      this.searchContent = ''
      this.getAllParkings()
    }
  }
}
</script>