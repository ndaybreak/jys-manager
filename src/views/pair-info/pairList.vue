<template>
  <div class="app-container">
    <el-table :data="data" border fit highlight-current-row
              style="width: 100%;min-height:300px;">
      <el-table-column align="center" :label="$t('table.category')" width="150" prop="catalog">
        <template slot-scope="scope">
          <span>{{scope.row.target_coin_code}}/{{scope.row.market_coin_code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCheck(scope.row)">{{$t('table.check')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { pairFetchAll } from '@/api/pairInfo'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'pairList',
    components: {
    },
    directives: {
      waves
    },
    data() {
      return {
        data: null
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        pairFetchAll().then(result => {
          this.data = result.data
        })
      },
      handleCheck(row) {
        this.$router.push({
          path: 'title-list',
          query: {
            categoryId: row.id,
            categoryName: row.target_coin_code + '/' + row.market_coin_code
          }
        })
      }
    }
  }
</script>
