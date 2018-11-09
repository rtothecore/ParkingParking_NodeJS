<template>
<!-- https://github.com/okchangwon/vue-daum-map -->
<v-dialog v-model="dialog" max-width="500px" max-height="600px">
  <div>
    <h1>주차장 위치</h1>

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

      style="width:500px;height:400px;">
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
  </div>
</v-dialog>
</template>

<script>
import {bus} from '../main'
import VueDaumMap from 'vue-daum-map'

export default {
  data () {
    return {
      markers: [],
      isSetCenter: 0,
      dialog: false,
      appKey: '18224044621f2ce03db4a65d7418f518',
      center: {lat: 33.450701, lng: 126.570667},
      level: 3,
      mapTypeId: VueDaumMap.MapTypeId.NORMAL,
      libraries: [],
      mapObject: null
    }
  },
  mounted () {
    var vm = this
    bus.$on('dialogForDaumMap', function (value) {
      vm.dialog = true
      vm.center.lat = value.lat
      vm.center.lng = value.lng

      // Create marker - http://itstory.tk/m/94, http://apis.map.daum.net/web/sample/multipleMarkerControl/
      let daummaps = window.daum.maps
      vm.hideMarkers()
      vm.addMarker(new daummaps.LatLng(vm.center.lat, vm.center.lng))
    })
  },
  created () {
  },
  // https://stackoverflow.com/questions/39382032/vue-js-unknown-custom-element
  components: {VueDaumMap: VueDaumMap},
  methods: {
    onLoad (map) {
      // 지도의 현재 영역을 얻어옵니다
      // var bounds = map.getBounds()
      // 영역정보를 문자열로 얻어옵니다. ((남,서), (북,동)) 형식입니다
      // var boundsStr = bounds.toString()
      // console.log('Daum Map Loaded', boundsStr)
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
    addMarker (position) {
      let daummaps = window.daum.maps
      var marker = new daummaps.Marker({
        position: position
      })
      marker.setMap(this.mapObject)
      this.markers.push(marker)
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
    }
  }
}
</script>