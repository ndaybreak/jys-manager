<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入UID" v-model="query.uid"></el-input>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.accountNumber"></el-input>
      <!--<el-date-picker v-model="query.beginTime" class="filter-item" type="datetime" :placeholder="$t('tip.request_start_date')"></el-date-picker>-->
      <!--<el-date-picker v-model="query.endTime" class="filter-item" type="datetime" :placeholder="$t('tip.request_end_date')"></el-date-picker>-->
      <!--<el-checkbox class="filter-item" style='margin-left:15px;' v-model="query.sortAsc">按申请时间正序排列</el-checkbox>-->
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleFilter" type="primary" icon="el-icon-search">{{$t('table.query')}}</el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="min-height:500px;">
      <!--<el-table-column align="center" label="状态" width="150" prop="status">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.status | statusFilter}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="UID" width="150" prop="auth_application_id"></el-table-column>-->
      <el-table-column align="center" :label="$t('table.email')" width="200" prop="email"></el-table-column>
      <el-table-column align="center" label="Currency" width="150" prop="coin_code"></el-table-column>
      <el-table-column align="center" label="Country/Region" width="200" prop="country_name"></el-table-column>
      <el-table-column align="center" label="Bank" width="150" prop="bank_name"></el-table-column>
      <el-table-column align="center" label="Account Name" width="150" prop="pay_account_name"></el-table-column>
      <el-table-column align="center" label="Account No." width="200" prop="pay_account_number"></el-table-column>
      <el-table-column align="center" label="Certificate" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.certificate">
            <img v-for="url in scope.row.certificate.split(',')" :src="url" @click="showicon(url)" alt="" style="height: 30px;">
          </span>
          <!--<img v-if="scope.row.certificate" @click="showicon(scope.row)" :src="scope.row.certificate.split(',')[0]" style="height: 50px;"/>-->
          <span v-else>_</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.createTime')" width="200" prop="create_time">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.auditor')" width="150" prop="name"></el-table-column>
      <el-table-column align="center" :label="$t('table.audit_date')" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.approve_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.remark')" width="150" prop="remark"></el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('table.audit')" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--v-if="scope.row.status == 0"-->
          <el-button v-if="scope.row.status === 0" type="primary" size="mini" @click="handleAudit(scope.row, 'pass')">{{$t('table.pass')}}</el-button>
          <el-button v-if="scope.row.status === 0" size="mini" type="danger" @click="handleAudit(scope.row, 'reject')">{{$t('table.reject')}}</el-button>
          <span v-if="scope.row.status != 0">{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--图片查看-->
    <transition name="slide-fade" class="fadeView">
      <div v-if="showImg">
        <image-view :imgArr="imgArr"
                    :showImageView="true"
                    :imageIndex="0"
                    v-on:hideImage="hideImageView"></image-view>
      </div>
    </transition>

  </div>
</template>

<script>
  import { bankCardFetchAll, bankCardAudit, customerInfoCheck } from '@/api/audit'
  import waves from '@/directive/waves' // 水波纹指令
  import PictureView from 'vue-simple-picture-preview'
  import { intl, isZh } from '@/utils'
  import imageView from 'vue-imageview'

  export default {
    name: 'bankCardAudit',
    components: {
      PictureView,
      'image-view': imageView
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          2: intl('map.rejected'),
          3: intl('map.audit_pass'),
          1: 'deleted',
          0: intl('map.auditing')
        }
        return statusMap[status]
      }
    },
    directives: {
      waves
    },
    data() {
      return {
        tempInfo: {
          // icons: ['http://img3.redocn.com/20120410/Redocn_2012041007514574.jpg', 'http://img.sccnn.com/bimg/338/24556.jpg']
          icons: []
        },
        showImg: false,
        list: null,
        total: null,
        listLoading: true,
        query: {
          currPage: 1,
          pageSize: 15
        },
        dialogFormVisible: false,
        statusList: [{
          id: 1,
          label: intl('map.auditing')
        }, {
          id: 2,
          label: intl('map.audit_pass')
        }, {
          id: 3,
          label: intl('map.rejected')
        }]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      showicon(url) {
        // this.imgArr = [row.certificate.split(',')]
        this.imgArr = [url]
        this.showImg = true
      },
      hideImageView() {
        this.showImg = false
      },
      getUploadType(en, zh) {
        return isZh() ? zh : en
      },
      checkAuthMaterials(row) {
        this.tempInfo.icons = []
        customerInfoCheck({ id: row.auth_application_id }).then(result => {
          // loading.close()
          const obj = result.data[0] || {}
          Object.assign(this.tempInfo, obj)
          // this.tempInfo.icons = [obj.credential_back_pic_addr, obj.credential_front_pic_addr, obj.credential_sign_pic_addr]
          obj.credential_back_pic_addr && this.tempInfo.icons.push(obj.credential_back_pic_addr)
          obj.credential_front_pic_addr && this.tempInfo.icons.push(obj.credential_front_pic_addr)
          obj.credential_sign_pic_addr && this.tempInfo.icons.push(obj.credential_sign_pic_addr)
          // this.tempInfo.icons = ['http://img3.redocn.com/20120410/Redocn_2012041007514574.jpg', 'http://img.sccnn.com/bimg/338/24556.jpg']
          this.dialogFormVisible = true
        })
      },
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
              if (!instance.inputValue) {
                this.$message.error(intl('tip.remark'))
                return
              }
              done()
            } else {
              done()
            }
          }
        }).then(({ value }) => {
          const para = {
            id: row.id,
            status: type === 'pass' ? 3 : 2,
            info: value
          }
          console.log(para)
          bankCardAudit(para).then(res => {
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
        bankCardFetchAll(para).then(result => {
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
  .video-default {
    width: 200px;
    height: 100px;
    cursor: pointer;
  }
  .picture-preview-container {
    display: inline-block;
  }
</style>
