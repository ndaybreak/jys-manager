import request from '@/utils/request'
import { filterEmptyAttr, kebabCaseData2Camel } from '@/utils'

// module--交易客户认证审核
// 条件查询 （账号，状态，申请时间，按照时间排序）
export function customerFetchAll(query) {
  return request({
    url: '/admin/managementSystem/queryWhereAuthByAccount',
    method: 'post',
    params: query
  })
}
// 交易客户认证审批
export function customerAudit(query) {
  return request({
    url: '/admin/managementSystem/updateAuthByAccount',
    method: 'post',
    params: query
  })
}
// 交易客户认证材料查看
export function customerInfoCheck(query) {
  return request({
    url: '/admin/managementSystem/queryAuthByAccountDetail',
    method: 'post',
    params: query
  })
}
// 交易客户备注查看
export function customerInfoLog(id) {
  return request({
    url: '/admin/managementSystem/queryAuthLog',
    method: 'post',
    params: {
      authApplicationId: id
    }
  })
}

// module--机构客户认证审核
// 条件查询 （账号，状态，申请时间，按照时间排序）
export function companyFetchAll(query) {
  return request({
    url: '/admin/managementSystem/queryWhereAuthEnterpriseByAccount',
    method: 'post',
    params: query
  })
}
// 机构客户认证审批
export function companyAudit(query) {
  return request({
    url: '/admin/managementSystem/updateAuthEnterpriseByAccount',
    method: 'post',
    params: query
  })
}
// 机构客户认证材料查看
export function companyInfoCheck(query) {
  return request({
    url: '/admin/managementSystem/queryAuthEnterpriseDetail',
    method: 'post',
    params: query
  })
}

// 交易客户备注查看
export function companyInfoLog(id) {
  return request({
    url: '/admin/managementSystem/queryAuthEnterpriseLog',
    method: 'post',
    params: {
      authEnterpriseId: id
    }
  })
}

// module--提现审核
// 管理员查看提现申请信息
export function withdrawFetchAll(query) {
  return request({
    url: '/withdrawCash/admin/getList',
    method: 'get',
    params: query
  })
}

// 提现申请审核通过
export function withdrawVerifyPass(query) {
  return request({
    url: '/withdrawCash/admin/verifyHandling',
    method: 'post',
    params: query
  })
}

// 提现申请审核拒绝
export function withdrawVerifyRefuse(query) {
  return request({
    url: '/withdrawCash/admin/verifyRefuse',
    method: 'post',
    params: query
  })
}

// 提现申请审核成功
export function withdrawSuccess(query) {
  return request({
    url: '/withdrawCash/admin/success',
    method: 'post',
    params: query
  })
}

// 提现申请审核失败
export function withdrawFail(query) {
  return request({
    url: '/withdrawCash/admin/fail',
    method: 'post',
    params: query
  })
}
// module--客户充值记录
export function rechargeFetchAll(query) {
  return request({
    url: '/rechargeCash/admin/getList',
    method: 'get',
    params: filterEmptyAttr(query)
  })
}
// module--客户充值记录
// 充值确认
export function rechargeConfirmation(data) {
  const para = kebabCaseData2Camel(data)
  return request({
    url: '/rechargeCash/admin/updateRechargeApplication',
    method: 'post',
    params: {
      id: para.id,
      quantity: para.quantity,
      fromAddress: para.fromAddress,
      txHash: para.txHash,
      block: para.block,
      info: para.info
    }
  })
}
// 充值失败
export function vcRechargeFail(para) {
  return request({
    url: '/rechargeCash/admin/updateRechargeApplicationFail',
    method: 'post',
    params: para
  })
}
// 更新法币提现结果
export function updateWithdrawResult(para) {
  return request({
    url: '/withdrawCash/admin/updateWithdrawResult',
    method: 'post',
    params: para
  })
}
// module--绑卡审核
// 条件查询 （账号）
export function bankCardFetchAll(query) {
  return request({
    url: '/pay/admin/getPayAccountInfoByAdmin',
    method: 'get',
    params: query
  })
}
// 绑卡审核
export function bankCardAudit(query) {
  return request({
    url: '/pay/admin/updatePayAccountInfo',
    method: 'post',
    params: query
  })
}

// module--法币提现审核
// 管理员查看法币提现申请信息
export function fiatWithdrawFetchAll(query) {
  return request({
    url: '/withdrawCash/admin/getWithdrawListByAdmin',
    method: 'get',
    params: query
  })
}

// 法币提现审核
export function fiatWithdrawAudit(query) {
  return request({
    url: '/withdrawCash/admin/approveWithdraw',
    method: 'post',
    params: query
  })
}

// module--法币充值审核
// 管理员查看法币充值申请信息
export function fiatRechargeFetchAll(query) {
  return request({
    url: '/rechargeCash/admin/getRechargeListByAdmin',
    method: 'get',
    params: query
  })
}

// 法币充值审核
export function fiatRechargeAudit(query) {
  return request({
    url: '/rechargeCash/admin/approveRecharge',
    method: 'post',
    params: query
  })
}
