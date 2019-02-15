<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="请输入UID" v-model="query.uid"></el-input>-->
      <el-input style="width: 200px;" class="filter-item" :placeholder="$t('tip.account')" v-model="query.email"></el-input>
      <el-select clearable style="width: 150px" class="filter-item" v-model="query.status" @change="handleFilter" :placeholder="$t('tip.audit_status')">
        <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker v-model="query.beginTime" class="filter-item" type="datetime" :placeholder="$t('tip.request_start_date')"></el-date-picker>
      <el-date-picker v-model="query.endTime" class="filter-item" type="datetime" :placeholder="$t('tip.request_end_date')"></el-date-picker>
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
      <el-table-column align="center" :label="$t('table.email')" width="150" prop="email"></el-table-column>
      <el-table-column align="center" :label="$t('table.area_code')" width="100" prop="area_code_test"></el-table-column>
      <!--<el-table-column align="center" :label="$t('table.mobile_number')" width="150" prop="mobile_number"></el-table-column>-->
      <el-table-column align="center" :label="$t('table.mobile_number')" width="150" prop="mobile_telephone"></el-table-column>
      <el-table-column align="center" :label="$t('table.authMaterials')" width="150">
        <template slot-scope="scope">
          <el-button round @click="checkAuthMaterials(scope.row)">{{$t('table.check')}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.request_date')" width="200" prop="apply_time">
        <template slot-scope="scope">
          <span>{{scope.row.apply_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.auditor')" width="150" prop="manager_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.audit_date')" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.approve_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.remark')" width="150" prop="approve_result_memo"></el-table-column>
      <el-table-column align="center" :label="$t('table.audit')" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 3" type="primary" size="mini" @click="handleAudit(scope.row, 'pass')">{{$t('table.pass')}}</el-button>
          <el-button v-if="scope.row.status === 3" size="mini" type="danger" @click="handleAudit(scope.row, 'reject')">{{$t('table.reject')}}</el-button>
          <span v-if="scope.row.status !== 3">{{scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="$t('table.check')" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="12">
          <h3>{{$t('table.baseInfo')}}</h3>
          <div class="dialog-item">Company Name: {{tempInfo.name}}</div>
          <div class="dialog-item">Nature of Business: {{tempInfo.nature_work}}</div>
          <div class="dialog-item">Contact Person: {{tempInfo.liaison_person}}</div>
          <div class="dialog-item">Registered Address: {{tempInfo.registered_address}}</div>
          <div class="dialog-item">Date of Incorporation: {{tempInfo.company_registration_date}}</div>
          <div class="dialog-item">Certificate Incorporation No.: {{tempInfo.company_registration_number}}</div>
          <div class="dialog-item">Email Address: {{tempInfo.contact_address}}</div>
          <div class="dialog-item">Contact No.: ({{tempInfo.contact_area_code}}) {{tempInfo.contact_number}}</div>
          <div class="dialog-item">{{$t('table.heading_code')}}: {{tempInfo.heading_code}}</div>
        </el-col>
        <el-col :span="12">
          <h3>Information of the person authorized to give instruction on Customer’s behalf</h3>
          <div class="dialog-item">Name: {{tempInfo.authorized_name}}</div>
          <div class="dialog-item">Position: {{tempInfo.position}}</div>
          <div class="dialog-item">Phone/Mobile No.: {{tempInfo.mobile}}</div>
          <div class="dialog-item">Passport/I.D. no.: {{tempInfo.passport}}</div>
          <h3>Type of Corporation</h3>
          <div class="dialog-item">Financial institution: {{tempInfo.code | corporationTypeFilter}}</div>
          <div class="dialog-item">Bank: {{tempInfo.bank | bankFilter}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <h3>Description of Family Members in Important Departments</h3>
          <div class="dialog-item" style="word-break: break-all;">{{tempInfo.explainInfo}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <h3>Information on directors and all shareholders holding more than 10% shares</h3>
          <el-table :data="tempInfo.parDirectorList" border fit highlight-current-row>
            <el-table-column align="center" label="Name" width="125" prop="name"></el-table-column>
            <el-table-column align="center" label="Residential Address" width="220" prop="residential_address"></el-table-column>
            <el-table-column align="center" label="Place of incorporation" width="220" prop="incorpration"></el-table-column>
            <el-table-column align="center" label="Director/Shareholder" width="220" prop="director_shareholder">
              <template slot-scope="scope">
                <span>{{scope.row.director_shareholder | directorFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Shareholding (%)" width="150" prop="shareholding"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!--<h3>{{$t('table.specimenSignature')}}</h3>-->
          <h3>Asset Certificate Documents</h3>
          <PictureView v-if="dialogFormVisible" :pictureList="tempInfo.picList"></PictureView>
          <div v-for="url in tempInfo.docList"><a :href="url" target="_blank">{{url}}</a></div>
        </el-col>
        <el-col :span="12">
          <h3>{{$t('table.customer_upload_info')}}: {{getUploadType(tempInfo.auth_pathway_english, tempInfo.auth_pathway_chinese)}}</h3>
          <PictureView v-if="dialogFormVisible" :pictureList="tempInfo.icons"></PictureView>
          <!--<img v-if="" class="video-default" src="../../assets/video_default.jpg" alt="">-->
          <video class="video-default" v-if="tempInfo.verify_video" :src="tempInfo.verify_video" controls="controls"></video>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogFormVisible = false">{{$t('table.close')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { companyFetchAll, companyAudit, companyInfoCheck } from '@/api/audit'
  import waves from '@/directive/waves' // 水波纹指令
  import PictureView from 'vue-simple-picture-preview'
  import { intl, isZh, deepClone } from '@/utils'

  function getFileList(str) {
    if (!str) {
      return [[], []]
    }
    const list = str.split(',')
    const r1 = []
    const r2 = []
    list.forEach(url => {
      if (url.indexOf('.pdf') > -1) {
        const i = url.lastIndexOf('/')
        r2.push(url.substr(i + 1))
      } else {
        r1.push(url)
      }
    })
    return [r1, r2]
  }

  export default {
    name: 'companyAudit',
    components: {
      PictureView
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: intl('map.notSubmit'),
          1: intl('map.rejected'),
          2: intl('map.audit_pass'),
          3: intl('map.auditing')
        }
        return statusMap[status]
      },
      directorFilter(status) {
        const statusMap = {
          1: 'Director',
          2: 'Shareholder'
        }
        return statusMap[status]
      },
      corporationTypeFilter(status) {
        const statusMap = {
          1: 'Financial Institution',
          2: 'Active NFE',
          3: 'Passive NFE'
        }
        return statusMap[status]
      },
      bankFilter(status) {
        const statusMap = {
          1: 'Bank',
          2: 'Asset/ Fund Management',
          3: 'Operator Stock Broking ',
          4: 'Fund',
          5: 'Insurance Company',
          6: 'Financial Market',
          7: 'Nominees/ Custodian',
          8: 'Listed on Exchange',
          9: 'Government firm / Agency',
          10: 'Other active NFE',
          11: 'Financial Institution and located in non-participating jurisdiction',
          12: 'NFE that is not an active NFE'
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
        list: null,
        total: null,
        listLoading: true,
        query: {
          currPage: 1,
          pageSize: 15
        },
        dialogFormVisible: false,
        statusList: [{
          id: 0,
          label: intl('map.notSubmit')
        }, {
          id: 1,
          label: intl('map.rejected')
        }, {
          id: 2,
          label: intl('map.audit_pass')
        }, {
          id: 3,
          label: intl('map.auditing')
        }]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getUploadType(en, zh) {
        return isZh() ? zh : en
      },
      checkAuthMaterials(row) {
        this.tempInfo = deepClone(row)
        const files = getFileList(this.tempInfo.picture_information)
        this.tempInfo.picList = files[0]
        this.tempInfo.docList = files[1]
        // this.tempInfo.picList = ['https://hkstox.io/files/coin/e73c82e2-3dd7-4360-8eed-4bd46834053d_BNB.png', 'https://hkstox.io/files/coin/e73c82e2-3dd7-4360-8eed-4bd46834053d_BNB.png']
        // this.tempInfo.docList = ['https://hkstox.io/files/account/holdCard/03abe1bb-5d5e-4cb7-a92a-9391ab1ec7e6_test.pdf', 'https://hkstox.io/files/account/holdCard/03abe1bb-5d5e-4cb7-a92a-9391ab1ec7e6_test.pdf']
        this.tempInfo.icons = []
        companyInfoCheck({ id: row.id }).then(result => {
          // loading.close()
          const obj = result.data || {}
          Object.assign(this.tempInfo, obj)
          // this.tempInfo.icons = [obj.credential_back_pic_addr, obj.credential_front_pic_addr, obj.credential_sign_pic_addr]
          obj.credential_back_addr && this.tempInfo.icons.push(obj.credential_back_addr)
          obj.credential_front_addr && this.tempInfo.icons.push(obj.credential_front_addr)
          // obj.credential_sign_pic_addr && this.tempInfo.icons.push(obj.credential_sign_pic_addr)
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
            status: type === 'pass' ? 2 : 1,
            approveResultMemo: value
          }
          console.log(para)
          companyAudit(para).then(res => {
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
        if (para.beginTime) {
          para.beginTime = para.beginTime.getTime() / 1000
        }
        if (para.endTime) {
          para.endTime = para.endTime.getTime() / 1000
        }
        companyFetchAll(para).then(result => {
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
