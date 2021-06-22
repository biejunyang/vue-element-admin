<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="formData" label-position="right" label-width="100px" style="">
        <el-form-item label="参数名称：" prop="name">
          <el-input v-model="formData.name" :disabled = "disableState"/>
        </el-form-item>
        <el-form-item label="参数编码：" prop="code">
          <el-input v-model="formData.code" :disabled = "disableState"/>
        </el-form-item>
        <el-form-item label="参数值：" prop="value">
          <el-input v-model="formData.value" :disabled = "disableState"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" :disabled = "disableState" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button v-if="type !== 'view'" type="primary" @click="save" :loading="saveLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createConfig, updateConfig } from '@/api/systemManage/sysConfigManage'

export default {
  name: 'ConfigDetail',
  props: {
    type: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default() { return {} }
    }
  },
  computed: {
    title() {
      if (this.type === 'create') {
        return '新增'
      } else if (this.type === 'update') {
        return '修改'
      } else if (this.type === 'view') {
        return '查看'
      } else {
        return ''
      }
    },
    dialogVisible: {
      get() {
        return this.type !== undefined && this.type !== ''
      },
      set(val) {
        if (!val) {
          this.$emit('update:type', '')
          this.$emit('update:formData', {})
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    disableState() {
      return this.type === 'view'
    }
  },
  data() {
    return {
      saveLoading: false,
      rules: {
        name: [{ required: true, message: '参数名称不能为空!', trigger: 'change' }],
        code: [{ required: true, message: '参数编码不能为空', trigger: 'change' }],
        value: [{ required: true, message: '参数编码不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
  },
  methods: {
    save() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.type === 'create') {
            this.saveLoading = true
            createConfig(this.formData).then(() => {
              this.dialogVisible = false
              // this.getList()
              this.$emit('success')
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
            }).finally(() => {
              this.saveLoading = false
            })
          } else if (this.type === 'update') {
            this.saveLoading = true
            updateConfig(this.formData).then(() => {
              this.dialogVisible = false
              // this.getList()
              this.$emit('success')
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }).finally(() => {
              this.saveLoading = false
            })
          }
        }
      })
    }
  }
}
</script>
