<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <sticky :className="'sub-navbar draft'">
        <div style="text-align: left;color: #666;">
          <span style="margin-right: 100px;margin-left: 46px;">{{$t('table.actions')}}：{{isEdit ? $t('table.edit') : $t('table.create')}}</span>
          Pair： {{categoryName}}</div>
        <el-button v-loading="loading" style="margin-left: 10px;position: absolute;top: 7px;right: 51px;" type="success" @click="submitForm">{{$t('table.publish')}}
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <div style="padding-bottom: 15px;">
          <el-form-item style="margin-bottom: 40px;" prop="title">
            <MDinput name="name" v-model="postForm.title" required :maxlength="100">
              {{$t('table.title')}}
            </MDinput>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="" prop="language" style="float: left; margin-right: 25px;">
                <el-select clearable class="filter-item" v-model="postForm.language" :placeholder="$t('tip.lang')">
                  <el-option v-for="item in languageList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="isNumber" style="float: left; margin-right: 25px;">
                <el-select clearable class="filter-item" v-model="postForm.isNumber" placeholder="Please select class">
                  <el-option v-for="item in classList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="postInfo-container-item" prop="releaseTime" style="float: left; margin-right: 25px;">
                <el-date-picker v-model="postForm.releaseTime" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                placeholder="Select publish date">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="postForm.content" :uploadUrl="uploadAction"/>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { titleDetail, titleSave, titleUpdate } from '@/api/pairInfo'
import { isEmpty, intl } from '@/utils'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  language: '',
  id: undefined,
  releaseTime: new Date(),
  targetMarketCoinId: ''
}

export default {
  name: 'articleDetail',
  components: { Tinymce, MDinput, Sticky },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      isEdit: false,
      categoryName: '',
      rules: {
        title: [{ required: true, message: intl('tip.title'), trigger: 'blur' }],
        language: [{ required: true, message: intl('tip.lang'), trigger: 'blur' }],
        isNumber: [{ required: true, message: intl('tip.class'), trigger: 'blur' }],
        incidentTime: [{ required: true, message: intl('tip.date'), trigger: 'blur' }]
      },
      languageList: [{
        id: 0,
        label: '中文'
      }, {
        id: 1,
        label: 'English'
      }],
      uploadAction: '',
      classList: [1, 2, 3]
    }
  },
  created() {
    this.uploadAction = this.baseUrl + '/file/public/uploadImg?type=12'
    this.categoryName = this.$route.query.categoryName
    this.isEdit = !!this.$route.query.titleId
    if (this.isEdit) {
      const id = this.$route.query.titleId
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
      this.postForm.targetMarketCoinId = this.$route.query.categoryId
    }
  },
  methods: {
    fetchData(id) {
      titleDetail(id).then(response => {
        this.postForm = response.data[0]
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (isEmpty(this.postForm.content)) {
            this.$message.error(intl('tip.content'))
            return
          }
          this.loading = true
          const action = this.isEdit ? titleUpdate : titleSave
          action(this.postForm).then(res => {
            console.log(111, res)
            this.$notify({
              title: this.$t('tip.successTitle'),
              message: intl('tip.publishSuccess'),
              type: 'success',
              duration: 2000
            })
            this.loading = false
            const view = {
              path: '/pair/pair-detail'
            }
            this.$store.dispatch('delVisitedViews', view).then((views) => {
              this.$router.push({
                path: 'title-list',
                query: {
                  categoryId: this.$route.query.categoryId,
                  categoryName: this.$route.query.categoryName
                }
              })
            })
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 20px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
