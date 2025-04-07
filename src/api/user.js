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

export function uploadAvatar(userId, file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: `/api/user/avatar/upload?userId=${userId}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}