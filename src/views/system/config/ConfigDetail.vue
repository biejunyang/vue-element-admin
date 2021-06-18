<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :rules="rules" :model="formData" label-position="right" label-width="100px" style="">
        <el-form-item label="参数名称：" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="参数编码：" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="参数值：" prop="value">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ConfigDetail',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    title() {
      if (this.type === 'create') {
        // this.dialogVisible = true
        return '新增'
      } else if (this.type === 'update') {
        // this.dialogVisible = true
        return '修改'
      } else if (this.type === 'view') {
        // this.dialogVisible = true
        return '查看'
      } else {
        // this.dialogVisible = false
        return ''
      }
    },
    // dialogVisible() {
    //   return this.type !== undefined && this.type !== ''
    // }
    dialogVisible: {
      get() {
        return this.type !== undefined && this.type !== ''
      },
      set(val) {
        this.$emit('update:type', val)
        // this.$store.dispatch('user/changeRoles', val).then(() => {
        //   this.$emit('change')
        // })
        // this.type = ''
        // this.dialogVisible = val
        // console.info(val)
      }
    }
  },
  data() {
    return {
      // dialogVisible: true,
      formData: {
        id: undefined,
        name: undefined,
        code: undefined,
        value: undefined,
        remark: undefined
      },
      rules: {}
    }
  },
  created() {
    console.info('xxxxxxxxxx,', this.type)
  },
  methods: {
    save() {

    },
    cancel() {
      this.$emit('update:type', '')
    }
  }
}
</script>
