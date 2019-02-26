<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select @change='handleFilter' clearable style="width: 120px" class="filter-item" v-model="query.isNumber" placeholder="Please select class">
        <el-option v-for="item in classList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <span style="margin-left: 100px;color: #666666;">Pair：{{categoryName}}</span>
    </div>

    <el-table :data="list" border fit highlight-current-row
              style="width: 100%;min-height:500px;">
      <el-table-column align="left" label="Class" width="80" prop="is_number"></el-table-column>
      <el-table-column align="left" :label="$t('table.title')" width="450" prop="title"></el-table-column>
      <el-table-column align="center" :label="$t('table.lang')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.language | languageFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Publish Date" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.publish_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.creator')" width="100" prop="creator_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.createTime')" width="160" prop="create_time">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.modifier')" width="100" prop="modifier_name"></el-table-column>
      <el-table-column align="center" :label="$t('table.modifyTime')" width="160" prop="modify_time">
        <template slot-scope="scope">
          <span>{{scope.row.modify_time | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.currPage" :page-sizes="[15,30,50,100]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { titleFetchAll, titleDelete } from '@/api/pairInfo'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'tileList',
    components: {
    },
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        query: {
          currPage: 1,
          pageSize: 15,
          isNumber: 1
        },
        categoryName: '',
        classList: [1, 2, 3]
      }
    },
    created() {
      this.query.targetMarketCoinId = this.$route.query.categoryId
      this.categoryName = this.$route.query.categoryName
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        titleFetchAll(this.query).then(result => {
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
      },
      handleDelete(row) {
        this.$confirm(this.$t('tip.del'), this.$t('tip.warning'), {
          confirmButtonText: this.$t('tip.confirm'),
          cancelButtonText: this.$t('tip.cancel'),
          type: 'warning'
        }).then(() => {
          titleDelete(row.id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('tip.success')
            })
            this.getList()
          })
        })
      },
      handleCreate() {
        this.$router.push({
          path: 'pair-detail',
          query: {
            categoryId: this.$route.query.categoryId,
            categoryName: this.$route.query.categoryName
          }
        })
      },
      handleFilter() {
        this.query.currPage = 1
        this.getList()
      },
      handleUpdate(row) {
        this.$router.push({
          path: 'pair-detail',
          query: {
            titleId: row.id,
            categoryId: this.$route.query.categoryId,
            categoryName: this.$route.query.categoryName
          }
        })
      }
    }
  }
</script>
