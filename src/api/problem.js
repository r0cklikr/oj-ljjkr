import request from './request'

export function getProblems(params) {
  return request({
    url: '/api/problems/page',
    method: 'get',
    params
  })
}

export function addProblem(data) {
  return request({
    url: '/api/problems/add',
    method: 'post',
    data
  })
}

export function getProblemDetail(id) {
  return request({
    url: `/api/problems/${id}`,
    method: 'get'
  })
}