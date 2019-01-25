<template>
  <div class="dashboard-container">
    <!--<component :is="currentRole"></component>-->
    <el-form :rules="rules" ref="updateForm" :model="temp" label-position="left" label-width="150px"
             style='width: 400px; margin-left:50px;'>
      <el-form-item label="Password" prop="password">
        <el-input class="filter-item" type="password" v-model="temp.password" :placeholder="$t('tip.input')"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: left;margin-left: 200px;margin-top: 60px;">
      <el-button type="primary" @click="updateData">Modify</el-button>
    </div>
  </div>
</template>

<script>
  import { updatePwd } from '@/api/system'

  export default {
    name: 'dashboard',
    components: {},
    data() {
      const validate = (rule, value, callback) => {
        var pwdReg = /^(?![0-9a-z#@*&!]+$)(?![0-9A-Z#@*&!]+$)(?![A-Za-z#@*&!]+$)(?![0-9a-zA-Z]+$)[0-9A-Za-z#@*&!]{8,12}$/
        if (!pwdReg.test(value)) {
          callback(new Error(this.$t('tip.password')))
        } else {
          callback()
        }
      }
      return {
        temp: {
          password: ''
        },
        rules: {
          password: [{ required: true, trigger: 'change', validator: validate }]
        }
      }
    },
    created() {
      console.log(1)
    },
    methods: {
      updateData() {
        this.$refs['updateForm'].validate((valid) => {
          if (valid) {
            updatePwd(this.temp.password).then((res) => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: this.$t('tip.successTitle'),
                message: this.$t('tip.updateSuccess'),
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .dashboard-container {
    text-align: center;
    height: 100%;
    padding-top: 100px;
  }
</style>
