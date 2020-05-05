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
export function getStudentsTask(params) {
  return request({
    url: 'api/studentexpense/financeTaskList',
    method: 'get'
  })
}

export function pass(params) {
  return request({
    url: 'api/studentexpense/apply?model=finance&taskId=' + params,
    method: 'get'
  })
}

export function reject(params) {
  return request({
    url: 'api/studentexpense/reject?taskId=' + params,
    method: 'get'
  })
}

export function startProcess(params) {
  return request({
    url: 'api/studentexpense/add?studentId=' + params,
    method: 'get'
  })
}

export default { add, edit, del, getStudentsTask, pass, reject, startProcess }
