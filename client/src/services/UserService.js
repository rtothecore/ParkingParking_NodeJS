import Api from '@/services/Api'

export default {
  fetchAllUser () {
    return Api().get('getAllUser')
  },

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
}
