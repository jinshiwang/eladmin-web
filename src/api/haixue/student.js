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

export function chart() {
  return request({
    url: 'api/students/chart',
    method: 'get'
  })
}

export function charttable() {
  return request({
    url: 'api/students/charttable',
    method: 'get'
  })
}

export default { add, edit, del, getStudents, chart, charttable }
