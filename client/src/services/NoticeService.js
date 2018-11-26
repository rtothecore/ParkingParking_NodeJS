import Api from '@/services/Api'

export default {

  fetchAllNotices () {
    return Api().get('getAllNotices')
  },

  createNewNotice (params) {
    return Api().post('addNewNotice', params)
  },

  updateNotice (params) {
    return Api().put('updateNotice/' + params.id, params)
  },

  deleteNotice (id) {
    return Api().delete('deleteNotice/' + id)
  }
  /*
  fetchUserByEmailNPw (params) {
    return Api().get('login/' + params.email + '/' + encodeURI(params.pw), params)
  },

  fetchUserLevelByEmail (params) {
    return Api().get('getUserLevel/' + params.email, params)
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
