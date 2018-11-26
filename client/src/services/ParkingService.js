import Api from '@/services/Api'

export default {
  fetchAllParking () {
    return Api().get('getAllParking')
  },

  fetchParkingsBy4 (params) {
    return Api().get('parkings/searchBy4/' + params.startDate + '/' + params.endDate + '/' + params.searchType + '/' + params.searchContent, params)
  },

  fetchParkingsBy2 (params) {
    return Api().get('parkings/searchBy2/' + params.display + '/' + params.searchContent, params)
  },

  fetchParkingWithDisplay (params) {
    return Api().get('getParkingWithDisplay/' + params.display, params)
  },

  deleteParking (id) {
    return Api().delete('deleteParking/' + id)
  },

  updateParking (params) {
    return Api().put('updateParking/' + params.id, params)
  },

  downloadExcel (params) {
    return Api().get('getExcel/' + params.fileName, params)
  }
}
