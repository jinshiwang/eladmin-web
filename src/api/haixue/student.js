import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/students',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/students',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/students',
    method: 'put',
    data
  })
}
export function getStudents(params) {
  return request({
    url: 'api/students',
    method: 'get',
    params
  })
}

export default { add, edit, del, getStudents }
