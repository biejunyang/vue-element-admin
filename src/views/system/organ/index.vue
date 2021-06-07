<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-tree
          ref="organTree"
          node-key="id"
          :data="organs"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          :props="{children:'children', label:'name'}"
          @node-click="clickNode"
        />
      </el-col>
      <el-col :span="20">
        <div class="filter-container">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="机构名称：">
              <el-input v-model="listQuery.name" placeholder="请输入机构名称" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-form-item>
            <el-form-item label=" ">
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
              <el-button v-waves class="filter-item" type="info" icon="el-icon-refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="height:36px;">
          <el-button v-permission="'organ_add'" v-waves class="filter-item" type="primary" size="mini" icon="el-icon-circle-plus" @click="handleCreate">新增</el-button>
          <el-button v-permission="'organ_edit'" v-waves class="filter-item" type="success" size="mini" icon="el-icon-edit" @click="handleUpdate">修改</el-button>
          <el-button v-permission="'organ_delete'" v-waves class="filter-item" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row @selection-change="handleSelectionChange"
          style="width: 100%;"

        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="机构名称" prop="name" align="center" width="180" />
          <el-table-column label="机构编码" prop="code" align="center" width="180" />
          <el-table-column label="机构路径" prop="code" align="center" width="180" />
          <el-table-column label="备注" prop="remark" />
          <el-table-column label="添加人" prop="createUser" align="center" />
          <el-table-column label="添加时间" prop="createTime" align="center" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" style="text-align:right" @pagination="getList" />

      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="formData" label-position="right" label-width="100px" style="width:80%; margin:auto;">
        <el-form-item label="机构名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构编码：" prop="code">
          <el-input v-model="formData.code" placeholder="请输入机构编码" />
        </el-form-item>
        <el-form-item label="上级机构：" prop="parent">
          <el-cascader
            v-model="formData.parent"
            placeholder="请输入上级机构"
            :options="parentOrgans"
            change-on-select
            :props="{value:'id', label:'name' }"
            clearable
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="排序：" prop="parent">
          <el-input-number v-model="formData.sort" :min="1" placeholder="请输入排序值" style="width:100%" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="formData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入机构备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchTree, createOrgan, updateOrgan, deleteOrgan } from '@/api/systemManage/organManage'
import waves from '@/directive/waves' // Waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defalutFormData = {
  id: undefined,
  name: undefined,
  code: undefined,
  parent: undefined,
  url: undefined,
  sort: undefined,
  remark: undefined
}
export default {
  name: 'RoleManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      // 机构树
      organs: [],

      // 列表页
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 20,
        name: undefined
      },
      multipleSelection: [],

      // 新增修改窗体
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      formData: Object.assign({}, defalutFormData),
      parentOrgans: [],
      rules: {
        name: [{ required: true, message: '机构名称必填!', trigger: 'change' }],
        code: [{ required: true, message: '机构编码必填', trigger: 'change' }]
      }

    }
  },
  created() {
    this.getList()
    this.getTree()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await fetchList(this.listQuery)
      this.list = res.data.records
      this.total = res.data.total
      this.listLoading = false
      this.multipleSelection = []
    },
    async getTree() {
      const res = await fetchTree()
      this.organs = res.data
      this.parentOrgans = res.data
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleReset() {
      this.listQuery.current = 1
      this.listQuery.name = undefined
      this.listQuery.pids = undefined
      this.$refs.organTree.setCurrentKey(null)
      this.getList()
      this.getTree()
    },
    resetData() {
      this.formData = Object.assign({}, defalutFormData)
    },
    handleCreate() {
      this.resetData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.info(this.formData.parent)
          if (this.formData.parent != null && this.formData.parent.length > 0) {
            this.formData.parentId = this.formData.parent[this.formData.parent.length - 1]
          } else {
            this.formData.parentId = undefined
          }
          createOrgan(this.formData).then(res => {
            if (res.status === 1) {
              this.dialogFormVisible = false
              this.getList()
              this.getTree()
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
            } else {
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
      if (this.multipleSelection.length <= 0) {
        this.$notify({ title: '提示', message: '请选择要编辑的记录', type: 'warning', duration: 2000 })
        return null
      }
      if (this.multipleSelection.length > 1) {
        this.$notify({ title: '提示', message: '只能选择一条记录编辑', type: 'warning', duration: 2000 })
        return null
      }
      const row = this.multipleSelection[0]
      this.formData = Object.assign({}, row) // copy obj
      if (row.pids !== null && row.pids !== '') {
        this.formData.parent = row.pids.split(',')
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.formData.parent != null && this.formData.parent.length > 0) {
            this.formData.parentId = this.formData.parent[this.formData.parent.length - 1]
          } else {
            this.formData.parentId = undefined
          }
          updateOrgan(this.formData).then(res => {
            if (res.status === 1) {
              this.dialogFormVisible = false
              this.getList()
              this.getTree()
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
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
    handleDelete() {
      if (this.selectRowIndex !== undefined && this.selectRowIndex > -1) {
        const row = this.list[this.selectRowIndex]
        deleteOrgan({ idList: [row.id] }).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        this.$notify({
          title: '提示',
          message: '请选择要删除的记录',
          type: 'warning',
          duration: 2000
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    clickNode(data) {
      this.listQuery.current = 1
      const pids = (data.pids != null && data.pids.length > 0 ? data.pids + ',' : '') + data.id
      this.listQuery.pids = pids
      this.getList()
    }

  }
}
</script>
<style lang="scss" scoped>

</style>
