import request from './request'

export function getSubmissionStatistics(userId) {
  return request({
    url: '/api/submissions/statistics',
    method: 'get',
    params: { userId }
  })
}