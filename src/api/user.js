import request from './request'

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    params: {
      userAccount: data.username,
      password: data.password
    }
  })
}

export function register(data) {
  return request({
    url: '/api/user/register',
    method: 'post',
    params: {
      userAccount: data.username,
      password: data.password
    }
  })
}

export function updateAvatar(userId, avatarUrl) {
  return request({
    url: '/api/user/update/avatar',
    method: 'post',
    params: {
      userId,
      avatarUrl
    }
  })
}