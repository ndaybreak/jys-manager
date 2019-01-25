<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入UID" v-model="query.accountId"></el-input>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.accountNumber"></el-input>
      <el-select clearable style="width: 150px" class="filter-item" v-model="query.status" @change="handleFilter" :placeholder="$t('tip.audit_status')">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker v-model="query.startTime" class="filter-item" type="datetime" :placeholder="$t('tip.request_start_date')"></el-date-picker>
      <el-date-picker v-model="query.endTime" class="filter-item" type="datetime" :placeholder="$t('tip.request_end_date')"></el-date-picker>
      <!--<el-checkbox class="filter-item" style='margin-left:15px;' v-model="query.sortAsc">按申请时间正序排列</el-checkbox>-->
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="min-height:500px;">
      <!--<el-table-column align="center" :label="$t('table.handleStatus')" width="100" prop="status">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.status | statusFilter}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" :label="$t('table.email')" width="150" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.area_code')" width="100" prop="area_code"></el-table-column>
      <el-table-column align="center" :label="$t('table.mobile_number')" width="120" prop="mobile_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.withdraw_coin')" width="80" prop="coin_code"></el-table-column>
      <el-table-column align="center" label="Order Number" width="120" prop="order_number"></el-table-column>
      <el-table-column align="center" label="Bank Name" width="120" prop="bank_name"></el-table-column>
      <el-table-column align="center" label="Account Name" width="120" prop="pay_account_name"></el-table-column>
      <el-table-column align="center" label="Account Number" width="150" prop="pay_account_number"></el-table-column>
      <el-table-column align="center" :label="$t('table.quantity')" width="80" prop="amount"></el-table-column>
      <el-table-column align="center" :label="$t('table.fee')" width="80" prop="service_fee"></el-table-column>
      <el-table-column align="center" :label="$t('table.request_date')" width="180" prop="create_time">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.auditor')" width="100" prop="verifier_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.operator')" width="100" prop="operator_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.remark')" width="150" prop="info"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="160" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.modifier_time | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" :label="$t('table.audit')" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" type="success" size="mini" @click="handleAudit(scope.row, 'pass')">{{$t('table.pass')}}</el-button>
          <el-button v-if="scope.row.status === 0" size="mini" type="danger" @click="handleAudit(scope.row, 'reject')">{{$t('table.reject')}}</el-button>
          <el-button v-if="scope.row.status === 2" type="success" size="mini" @click="handleResult(scope.row, 'success')">{{$t('table.success')}}</el-button>
          <el-button v-if="scope.row.status === 2" size="mini" type="warning" @click="handleResult(scope.row, 'fail')">{{$t('table.fail')}}</el-button>
          <span v-if="scope.row.status !== 0 && scope.row.status !== 2">{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  // customerInfoCheck
  import { fiatWithdrawFetchAll, fiatWithdrawAudit, updateWithdrawResult } from '@/api/audit'
  import waves from '@/directive/waves' // 水波纹指令
  import { intl } from '@/utils'
  import imageView from 'vue-imageview'

  export default {
    name: 'customerAudit',
    components: {
      'image-view': imageView
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: intl('map.to_audit'),
          1: intl('map.audit_fail'),
          2: intl('map.audit_pass'),
          4: intl('map.success'),
          3: intl('map.fail')
        }
        return statusMap[status]
      }
    },
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        query: {
          currPage: 1,
          pageSize: 15
        },
        statusList: [{
          id: 0,
          label: intl('map.to_audit')
        }, {
          id: 1,
          label: intl('map.audit_fail')
        }, {
          id: 2,
          label: intl('map.audit_pass')
        }]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      },
      handleAudit(row, type) {
        const content = type === 'pass' ? intl('tip.audit_pass') : intl('tip.audit_fail')
        this.$prompt(content, this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          inputType: 'textarea',
          inputPlaceholder: intl('table.remark'),
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              if (type === 'reject' && !instance.inputValue) {
                this.$message.error(intl('tip.reject_reason'))
                return
              }
              done()
            } else {
              done()
            }
          }
        }).then(({ value }) => {
          const para = {
            withdrawId: row.id,
            refuseReason: value,
            approved: type === 'pass' ? 2 : 1
          }
          fiatWithdrawAudit(para).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      handleResult(row, type) {
        const content = type === 'success' ? 'are you sure the operation is successful?' : 'are you sure the operation is fail?'
        this.$prompt(content, this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          inputType: 'textarea',
          inputPlaceholder: intl('table.remark'),
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              if (type === 'fail' && !instance.inputValue) {
                this.$message.error(intl('tip.reject_reason'))
                return
              }
              done()
            } else {
              done()
            }
          }
        }).then(({ value }) => {
          const para = {
            withdrawId: row.id,
            failReason: value,
            withdrawResult: type === 'success' ? 4 : 3
          }
          updateWithdrawResult(para).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      getList() {
        this.listLoading = true
        const para = Object.assign({}, this.query)
        if (para.startTime) {
          para.startTime = para.startTime.getTime()
        }
        if (para.endTime) {
          para.endTime = para.endTime.getTime()
        }
        fiatWithdrawFetchAll(para).then(result => {
          this.listLoading = false
          this.list = result.data
          this.total = result.pageInfo.totalCount
          if (this.list.length === 0 && this.query.currPage !== 1) {
            this.getList()
          }
        })
      },
      handleSizeChange(val) {
        this.query.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.query.currPage = val
        this.getList()
      }
    }
  }
</script>
<style scoped>
  .dialog-item {
    padding: 10px 0;
  }
</style>
