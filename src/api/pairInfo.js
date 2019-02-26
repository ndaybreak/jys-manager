import request from '@/utils/request'
// import { kebabCaseData2Camel } from '@/utils'

// 获取交易对列表
export function pairFetchAll(query) {
  return request({
    url: '/officialCenter/admin/queryByTargetMarketCoin',
    method: 'post',
    params: {
      currPage: 1,
      pageSize: 2000
    }
  })
}

// 获取标题列表
export function titleFetchAll(query) {
  return request({
    url: '/officialCenter/admin/queryOfficialCoinWhereByIsNumber',
    method: 'post',
    params: query
  })
}

// 新增标题及内容
export function titleSave(data) {
  return request({
    url: '/officialCenter/admin/saveOfficialInfoTitle',
    method: 'post',
    data: {
      officialList: [data]
    }
  })
}

// 查看详情
export function titleDetail(id) {
  return request({
    url: '/officialCenter/admin/queryOfficialInfoTitleByid',
    method: 'post',
    params: { id }
  })
}

// 编辑详情
export function titleUpdate(data) {
  return request({
    url: '/officialCenter/admin/updateOfficialInfoTitleByid',
    method: 'post',
    data: data
  })
}

// 删除标题
export function titleDelete(id) {
  return request({
    url: '/officialCenter/admin/updateInfoTitleByid',
    method: 'post',
    params: { id }
  })
}
