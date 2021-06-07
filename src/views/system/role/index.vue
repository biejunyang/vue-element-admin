<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" label-position="right" label-width="160px">
        <el-form-item label="角色名称：">
          <el-input v-model="listQuery.name" placeholder="请输入名称" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="角色编号">
          <el-input v-model="listQuery.name" placeholder="请输入名称" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label=" ">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button v-waves class="filter-item" type="info" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height:36px;">
      <el-button v-permission="'role_add'" v-waves class="filter-item" type="primary" size="mini" icon="el-icon-circle-plus" @click="handleCreate">新增</el-button>
      <el-button v-permission="'role_edit'" v-waves class="filter-item" type="success" size="mini" icon="el-icon-edit" @click="handleUpdate">修改</el-button>
      <el-button v-permission="'role_delete'" v-waves class="filter-item" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      <el-button v-permission="'role_grant_privilege'" v-waves class="filter-item" type="primary" size="mini" icon="el-icon-edit" @click="handleGrant">授权</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="" align="center" width="80">
        <template slot-scope="scope">
          <el-radio v-model="selectRowIndex" :label="scope.$index">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="name" align="center" width="180" />
      <el-table-column label="角色编码" prop="code" align="center" width="180" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="添加人" prop="createUser" align="center" />
      <el-table-column label="添加时间" prop="createTime" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" prop="udpateUser" align="center" />
      <el-table-column label="更新时间" prop="updateTime" align="center" width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.update">{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" :page-sizes="[1,2,3]" style="float:right" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="formData" label-position="right" label-width="100px" style="">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="角色编码：" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色授权" :visible.sync="dialogGrantVisible">
      <el-tree
        ref="privilegeTree"
        :data="privileges"
        show-checkbox
        check-strictly
        node-key="id"
        :default-expanded-keys="expendkeys"
        highlight-current
        :props="{children:'children', label:'name'}"
        @check="checkNode"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGrantVisible = false">取消</el-button>
        <el-button type="primary" @click="grant">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createRole, updateRole, deleteRole, fetchRolePrivilegeIds, grantPrivileges } from '@/api/systemManage/roleManage'
import { fetchPrivileges } from '@/api/systemManage/userManage'
import waves from '@/directive/waves' // Waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RoleManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {

      // 列表页
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 2,
        name: undefined,
        code: undefined
      },
      selectRowIndex: undefined,

      // 新增修改窗体
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      formData: {
        id: undefined,
        name: undefined,
        code: undefined,
        remark: undefined
      },
      rules: {
        name: [{ required: true, message: '角色名称必填!', trigger: 'change' }],
        code: [{ required: true, message: '角色编码必填', trigger: 'change' }]
      },
      // 授权窗体
      dialogGrantVisible: false,
      privileges: undefined,
      expendkeys: []

    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await fetchList(this.listQuery)
      this.list = res.data.records
      this.total = res.data.total
      this.listLoading = false
      this.selectRowIndex = undefined
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleReset() {
      this.listQuery.current = 1
      this.listQuery.name = undefined
      this.listQuery.code = undefined
      this.getList()
    },
    resetData() {
      this.formData = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
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
          this.formData.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.formData.author = 'vue-element-admin'
          createRole(this.formData).then(() => {
            // this.list.unshift(this.formData)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate() {
      if (this.selectRowIndex !== undefined && this.selectRowIndex > -1) {
        const row = this.list[this.selectRowIndex]
        this.formData = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      } else {
        this.$notify({
          title: '提示',
          message: '请选择要编辑的记录',
          type: 'warning',
          duration: 2000
        })
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateRole(this.formData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete() {
      if (this.selectRowIndex !== undefined && this.selectRowIndex > -1) {
        const row = this.list[this.selectRowIndex]
        deleteRole({ idList: [row.id] }).then(() => {
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
    handleGrant() {
      if (this.selectRowIndex === undefined || this.selectRowIndex < 0) {
        this.$notify({
          title: '提示',
          message: '请选择要授权的记录',
          type: 'warning',
          duration: 2000
        })
        return
      }
      const row = this.list[this.selectRowIndex]
      this.dialogGrantVisible = true
      this.privileges = []
      this.expendkeys = []
      fetchPrivileges({ userId: 1 }).then(res => {
        this.privileges = res.data
        fetchRolePrivilegeIds({ roleId: row.id }).then(r => {
          this.$refs.privilegeTree.setCheckedKeys(r.data)
          // 选中的默认展开
          this.expendkeys = r.data
        })
      })
    },
    grant() {
      const row = this.list[this.selectRowIndex]
      const checkedKeys = this.$refs.privilegeTree.getCheckedKeys()
      grantPrivileges({ roleId: row.id, privilegeIds: checkedKeys }).then(res => {
        this.$notify({
          title: '成功',
          message: '授权成功',
          type: 'success',
          duration: 2000
        })
        this.dialogGrantVisible = false
      })
    },
    checkNode(node, checkedInfo) {
      // 选中的节点的key
      const checkedkeys = checkedInfo.checkedKeys != null ? checkedInfo.checkedKeys : []
      if (checkedkeys.indexOf(node.id) > -1) { // 选中
        checkedkeys.push(node.id)
        if (node.children != null && node.children.length > 0) {
          this.getChildrenKeys(node.children, checkedkeys)
        }

        const pidsStr = node.pids
        if (pidsStr != null && pidsStr.length > 0) {
          const pids = pidsStr.split(',')
          pids.forEach(i => checkedkeys.push(i))
        }
      } else { // 取消选中
        const childrenKeys = []
        this.getChildrenKeys(node.children, childrenKeys)
        // 直接点如果是选中状态，则取消选中
        childrenKeys.forEach(t => {
          const index = checkedkeys.indexOf(t)
          if (index > -1) {
            checkedkeys.splice(index, 1)
          }
        })
      }
      // 设置选中
      this.$refs.privilegeTree.setCheckedKeys(checkedkeys)
    },
    getChildrenKeys(children, keys) {
      if (children != null && children.length > 0) {
        children.forEach(el => {
          keys.push(el.id)
          this.getChildrenKeys(el.children, keys)
        })
      }
    }

  }
}
</script>
<style lang="scss" scoped>

</style>
