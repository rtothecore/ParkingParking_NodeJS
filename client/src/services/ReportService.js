import Api from '@/services/Api'

export default {
  fetchAllReport () {
    return Api().get('getAllReport')
  },

  fetchReportsBy4 (params) {
    return Api().get('reports/searchBy4/' + params.startDate + '/' + params.endDate + '/' + params.searchType + '/' + params.searchContent, params)
  },

  updateReport (params) {
    return Api().put('updateReport', params)
  },

  updateReportWithHoldreason (params) {
    return Api().put('updateReportWithHoldreason', params)
  },

  deleteReport (params) {
    return Api().delete('deleteReport/' + params.code)
  }
  /*
  fetchUserByEmailNPw (params) {
    return Api().get('login/' + params.email + '/' + encodeURI(params.pw), params)
  },

  fetchUserLevelByEmail (params) {
    return Api().get('getUserLevel/' + params.email, params)
  },

  createNewUser (params) {
    return Api().post('addNewUser', params)
  },

  updateUser (params) {
    return Api().put('updateUser/' + params.id, params)
  },

  deleteUser (id) {
    return Api().delete('deleteUser/' + id)
  },

  leaveUser (id) {
    return Api().delete('leaveUser/' + id)
  },

  checkDupllicatedUserEmail (email) {
    return Api().get('getDuplicatedEmail/' + email)
  },

  fetchUsersBy4 (params) {
    return Api().get('users/searchBy4/' + params.startDate + '/' + params.endDate + '/' + params.searchType + '/' + params.searchContent, params)
  }
  */
}
