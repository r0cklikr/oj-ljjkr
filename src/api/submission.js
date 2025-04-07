import request from './request'

export function submitCode(data) {
  return request({
    url: '/api/submissions/submit',
    method: 'post',
    data
  })
}