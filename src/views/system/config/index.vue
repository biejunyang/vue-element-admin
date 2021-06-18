<template>
  <div class="app-container">
      <div class="filter-container">
        <el-form :inline="true" :model="listQuery" label-position="right" label-width="160px">
          <el-form-item label="参数名称：">
            <el-input v-model="listQuery.name" placeholder="请输入名称"  @keyup.enter.native="handleSearch" />
          </el-form-item>
          <el-form-item label="参数编号">
            <el-input v-model="listQuery.code" placeholder="请输入名称"  @keyup.enter.native="handleSearch" />
          </el-form-item>
          <el-form-item label=" ">
            <el-button v-waves type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            <el-button v-waves type="info" icon="el-icon-refresh" @click="handleResetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="btn-container" style="margin-bottom: 5px;">
        <el-button v-waves type="primary" size="mini" icon="el-icon-circle-plus" @click="handleCreate">新增</el-button>
        <el-button v-waves type="success" size="mini" icon="el-icon-edit" @click="handleUpdate">修改</el-button>
        <el-button v-waves type="primary" size="mini" icon="el-icon-delete" @click="handleView">查看</el-button>
        <el-button v-waves type="danger" size="mini" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      </div>

      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="参数名称" prop="name" />
        <el-table-column label="参数编码" prop="code" />
        <el-table-column label="参数值" prop="value" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="添加人" prop="createUser" />
        <el-table-column label="添加时间" prop="createTime" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新人" prop="updateUser" />
        <el-table-column label="更新时间" prop="updateTime" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :page-sizes="[20,30,40]" style="float:right" @pagination="getList" />

      <configDetail :type="optType"></configDetail>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ConfigDetail from './ConfigDetail' // Secondary package based on el-pagination
import { fetchList } from '@/api/systemManage/sysConfigManage'
export default {
  name: 'SysConfigManage',
  components: { Pagination, ConfigDetail },
  directives: { waves },
  data() {
    return {
      listQuery: {
        page: 1,
        size: 20,
        name: undefined,
        code: undefined
      },
      listLoading: false,
      list: [],
      total: 0,
      selection: [],
      optType: ''
      // // 新增修改窗体
      // dialogFormVisible: false,
      // dialogStatus: '',
      // textMap: {
      //   update: '修改',
      //   create: '新增'
      // },
      // formData: {
      //   id: undefined,
      //   name: undefined,
      //   code: undefined,
      //   remark: undefined
      // },
      // rules: {
      //   name: [{ required: true, message: '角色名称必填!', trigger: 'change' }],
      //   code: [{ required: true, message: '角色编码必填', trigger: 'change' }]
      // },
      // // 授权窗体
      // dialogGrantVisible: false,
      // privileges: [],
      // expendkeys: []

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
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    handleResetSearch() {
      this.listQuery.page = 1
      this.listQuery.name = undefined
      this.listQuery.code = undefined
      this.getList()
    },
    handleCreate() {
      this.optType = 'create'
    },
    handleUpdate() {
      this.optType = 'update'
    },
    handleView() {
      this.optType = 'view'
    },
    handleDelete() {

    },
    handleSelectionChange(val) {
      this.selection = val
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
