// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'
import 'vuetify/dist/vuetify_mod.css'
/*
import FullCalendar from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.min.css'
*/

import RegisterModal from './components/RegisterModal.vue'
/*
import JournalModal from './components/JournalModal.vue'
import JournalModalForEdit from './components/JournalModalForEdit.vue'
import AddWorkTypeModal from './components/AddWorkTypeModal.vue'
import SearchAddressModal from './components/SearchAddressModal.vue'
*/
import ReportDaumMap from './components/ReportDaumMap.vue'
import ReportImage from './components/ReportImage.vue'
import ParkingExcel from './components/ParkingExcel.vue'
import ParkingManagerMapDetail from './components/ParkingManagerMapDetail'

import VeeValidate from 'vee-validate'
import VueSweetalert2 from 'vue-sweetalert2'
// https://alligator.io/vuejs/vue-media-queries/
import VueMq from 'vue-mq'
// https://www.npmjs.com/package/vue-session
import VueSession from 'vue-session'
// import axios from 'axios'
// import VueDaumMap from 'vue-daum-map'

Vue.component('registerModal', RegisterModal)
/*
Vue.component('journalModal', JournalModal)
Vue.component('journalModalForEdit', JournalModalForEdit)
Vue.component('addWorkTypeModal', AddWorkTypeModal)
Vue.component('searchAddressModal', SearchAddressModal)
*/
Vue.component('daumMapModal', ReportDaumMap)
Vue.component('imageModal', ReportImage)
Vue.component('parkingExcel', ParkingExcel)
Vue.component('parkingManagerMapDetail', ParkingManagerMapDetail)

Vue.use(Vuetify)
// Vue.use(FullCalendar)
Vue.use(VeeValidate)
Vue.use(VueSweetalert2)
Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 900,
    laptop: 1250,
    desktop: Infinity
  }
})
Vue.use(VueSession)
// Vue.prototype.$http = axios
// Vue.use(VueDaumMap)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

export const bus = new Vue()
