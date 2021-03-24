<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary"  size="mini" icon="el-icon-circle-plus" @click="handleCreate">新增</el-button>
      <el-button v-waves class="filter-item" type="success" size="mini" icon="el-icon-edit" @click="handleUpdate">修改</el-button>
      <el-button v-waves class="filter-item" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      <el-button v-waves class="filter-item" type="info" size="mini" icon="el-icon-refresh" @click="handleFilter">刷新</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border fit
      highlight-current-row
      @current-change="handleCurrentChange"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%;"
    >
      <el-table-column label="名称" prop="name" width="180" />
      <el-table-column label="编码" prop="code" align="center" />
      <el-table-column label="类型" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.type | privilegeTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求地址" prop="url" align="center" />
      <el-table-column label="排序" prop="sort" align="center" />
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="70%">
      <el-form ref="dataForm" :rules="rules" :model="formData" label-position="right" label-width="100px" >
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="权限名称：" prop="name">
              <el-input v-model="formData.name"  placeholder="请输入权限名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识：" prop="code">
              <el-input v-model="formData.code"  placeholder="请输入权限标识"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型：" prop="type">
              <el-radio v-model="formData.type" label="1" @change="changeType" :disabled="formDisabled.type">目录</el-radio>
              <el-radio v-model="formData.type" label="2" @change="changeType" :disabled="formDisabled.type">菜单</el-radio>
              <el-radio v-model="formData.type" label="3" @change="changeType" :disabled="formDisabled.type">按钮</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级：" prop="parent">
              <el-cascader  placeholder="请输入父级菜单"  v-model="formData.parent"
                :options="options" change-on-select :disabled="formDisabled.parent"
                :props="{value:'id', label:'name' }"
                clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址：" prop="url">
              <el-input v-model="formData.url" placeholder="请输入权限地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序：" prop="sort">
              <el-input-number v-model="formData.sort" :min="1" ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { fetchList, createPrivilege, updatePrivilege, deletePrivilege } from '@/api/systemManage/privilegeManage'
import { privilegeTypeFilter } from '@/filters/businessFilter'

const defalutFormData = {
  id: undefined,
  name: undefined,
  code: undefined,
  type: '1',
  parent: undefined,
  url: undefined,
  sort: undefined
}
const defaultFormDisabled = {
  type: false,
  parent: false
}
export default {
  // components: { Pagination },
  filters: {
    privilegeTypeFilter
  },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: false,
      selectedRow: undefined,

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      options:[{id:1, name:'系统管理', children:[{id:2, name:'用户管理'},{id:3, name:'角色管理'}]}],
      formData: Object.assign({}, defalutFormData),
      formDisabled: Object.assign({}, defaultFormDisabled),
      rules: {
        name: [{ required: true, message: '权限名称必填！', trigger: 'change' }],
        code: [{ required: true, message: '权限标识必填', trigger: 'change' }]
      }

    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await fetchList()
      this.list = res.data
      this.listLoading = false
      console.info(res)
    },
    handleFilter() {
      this.getList()
    },
    resetForm() {
      this.formData = Object.assign({}, defalutFormData)
      this.formDisabled = Object.assign({}, defaultFormDisabled)
    },
    handleCurrentChange(val) {
      this.selectedRow = val;
    },
    changeType(val){
      let type = (val === '3' ? 2 : 1);
      fetchList({type}).then(res => {
        this.options=res.data
      })
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      fetchList({type:1}).then(res => {
        this.options=res.data
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.info(this.formData.parent)
          if(this.formData.parent!=null && this.formData.parent.length>0){
            this.formData.parentId = this.formData.parent[this.formData.parent.length-1]
          }else{
            this.formData.parentId = undefined
          }
          createPrivilege(this.formData).then(res => {
            if(res.status==1){
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }else{
              this.$notify({
                title: '失败',
                message: res.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate() {
      if(this.selectedRow ==  null){
        this.$notify({
          title: '提示',
          message: '请选择要修改的记录',
          type: 'warning',
          duration: 2000
        })
        return;
      }
      this.formData = Object.assign({}, this.selectedRow) // copy obj
      this.formData.type=String(this.formData.type)
      
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      
      let type = (this.selectedRow.type === 3 ? 2 : 1);
      fetchList({type}).then(res => {
        this.options=res.data
        if(this.selectedRow.pids!=null && this.selectedRow.pids!=''){
          this.formData.parent=this.selectedRow.pids.split(',')
        }
      })
      this.formDisabled.type=true
      this.formDisabled.parent=true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatePrivilege(this.formData).then(res => {
            if(res.status==1){
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }else{
              this.$notify({
                title: '失败',
                message: res.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      if(this.selectedRow ==  null){
        this.$notify({
          title: '提示',
          message: '请选择要删除的记录',
          type: 'warning',
          duration: 2000
        })
        return;
      }
      deletePrivilege(this.selectedRow.id).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
