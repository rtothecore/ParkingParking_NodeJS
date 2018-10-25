import Api from '@/services/Api'

export default {
  updateJournal (params) {
    return Api().put('journals/' + params.id, params)
  },

  deleteJournal (id) {
    return Api().delete('journals/' + id)
  },

  fetchJournalsWorktime (params) {
    return Api().get('journals/searchWorktime/' + params.userId + '/' + params.startDate + '/' + params.endDate + '/' + params.landId, params)
  },

  fetchJournalsBy4 (params) {
    return Api().get('journals/searchBy4/' + params.startDate + '/' + params.endDate + '/' + params.workType + '/' + params.workContent, params)
  },

  fetchJournalsByYM (params) {
    return Api().get('journals/searchByYM/' + params.ym, params)
  },

  fetchJournalsByYMUserId (params) {
    return Api().get('journals/searchByYMUserId/' + params.ym + '/' + params.userId, params)
  },

  fetchJournalsByDate (params) {
    return Api().get('journals/' + params.startDate + '/' + params.endDate, params)
  },

  fetchJournalsByDateNUserId (params) {
    return Api().get('journals/' + params.startDate + '/' + params.endDate + '/' + params.userId, params)
  },

  fetchJournals (params) {
    return Api().get('journals/' + params.userId, params)
  },

  fetchJournal (params) {
    return Api().get('journal/' + params.id, params)
  },

  createJournals (params) {
    return Api().post('journals', params)
  }
}
