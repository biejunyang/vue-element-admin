<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" >
        <el-form-item label="账户：">
          <el-input v-model="listQuery.name" placeholder="请输入名称"  @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="listQuery.disabled" placeholder="请输入状态"  @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label=" ">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button v-waves class="filter-item" type="info" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height:36px;">
      <el-button v-waves class="filter-item" type="primary"  size="mini" icon="el-icon-circle-plus" @click="handleCreate">新增</el-button>
      <el-button v-waves class="filter-item" type="success" size="mini" icon="el-icon-edit" @click="handleUpdate">修改</el-button>
      <el-button v-waves class="filter-item" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      <el-button v-waves class="filter-item" type="primary"  size="mini" icon="el-icon-edit" @click="handleGrant">授权</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- <el-table-column label=""  align="center" width="80">
        <template slot-scope="scope">
          <el-radio v-model="selectRowIndex" :label="scope.$index">&nbsp;</el-radio>
        </template>
      </el-table-column> -->
      <el-table-column label="账号" prop="username" align="center" />
      <el-table-column label="姓名" prop="realName" align="center" />
      <el-table-column label="手机号" prop="phone" align="center" />
      <el-table-column label="出生日期" prop="birthday" align="center" />
      <el-table-column label="邮箱" prop="email" align="center"/>
      <el-table-column label="所属机构" prop="organName"  />
      <el-table-column label="添加人" prop="createUser" align="center"/>
      <el-table-column label="添加时间" prop="createTime" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" :pageSizes="[1,2,3]" style="float:right"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="formData" label-position="right" label-width="100px" style="">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="formData.username" placeholder="请输入用户名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="realName">
              <el-input v-model="formData.realName" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码：" prop="password">
              <el-input v-model="formData.password" placeholder="请输入密码" type="password"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码：" prop="repassword">
              <el-input v-model="formData.repassword" placeholder="请重复密码" type="password"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称：" prop="nickName">
              <el-input v-model="formData.nickName" placeholder="请输入昵称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期：" prop="birthday">
              <el-date-picker v-model="formData.birthday" type="date" placeholder="请输入出生日期" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" prop="sex">
               <el-radio v-model="formData.sex" label="1">男</el-radio>
               <el-radio v-model="formData.sex" label="2">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="formData.email" placeholder="请输入邮箱"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构：" prop="organ">
              <el-cascader  placeholder="请输入所属机构"  v-model="formData.organ"
                :options="organs" change-on-select 
                :props="{value:'id', label:'name' }"
                clearable style="width:100%"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
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
        show-checkbox check-strictly
        node-key="id"
        :default-expanded-keys="expendkeys"
        highlight-current
        @check="checkNode"
        :props="{children:'children', label:'name'}">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGrantVisible = false">取消</el-button>
        <el-button type="primary" @click="grant">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createUser, updateUser, deleteUser, fetchRolePrivilegeIds, grantPrivileges } from '@/api/systemManage/userManage'
import { fetchTree } from '@/api/systemManage/organManage'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defalutFormData = {
  id: undefined,
  username: undefined,
  realName: undefined,
  passowrd: undefined,
  repassword: undefined,
  nickName: undefined,
  birthday: undefined,
  sex: undefined,
  email: undefined,
  phone: undefined,
  organ: undefined
}
export default {
  name: 'roleManage',
  components: { Pagination },
  directives: { waves },
  data() {
     var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.formData.repassowrd !== '') {
            this.$refs.dataForm.validateField('repassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formData.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
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
      selectRowIndex:undefined,

      // 新增修改窗体
      dialogFormVisible: false,
      organs:[],
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      formData: Object.assign({}, defalutFormData),
      rules: {
        username: [{ required: true, message: '请输入用户名!', trigger: 'change' }],
        realName: [{ required: true, message: '请输入姓名!', trigger: 'change' }],
        password: [
          { required: true, message: '密码不能为空!', trigger: 'change' },
          { validator: validatePass, trigger: 'change' }
        ],
        repassword: [
          { required: true, message: '请再次输入密码!', trigger: 'change' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        organ: [{ required: true, message: '请选择所属机构', trigger: 'change' }]
      },
      // 授权窗体
      dialogGrantVisible: false,
      privileges: undefined,
      expendkeys:[]

      
    }
  },
  created() {
    this.getList()
    this.getOrgans()
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
    async getOrgans() {
      const res = await fetchTree()
      this.organs = res.data
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
          if(this.formData.organ!=null && this.formData.organ.length>0){
            this.formData.organId = this.formData.organ[this.formData.organ.length-1]
          }else{
            this.formData.organId = undefined
          }
          createUser(this.formData).then(res => {
            if(res.status==1){
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '新增成功',
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
      if(this.selectRowIndex!=undefined && this.selectRowIndex > -1){
        let row=this.list[this.selectRowIndex]
        this.formData = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }else{
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
          updateUser(this.formData).then(() => {
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
      if(this.selectRowIndex!=undefined && this.selectRowIndex > -1){
        let row=this.list[this.selectRowIndex]
        deleteUser({idList: [row.id]}).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      }else{
        this.$notify({
              title: '提示',
              message: '请选择要删除的记录',
              type: 'warning',
              duration: 2000
            })
      }
    },
    handleGrant(){
      if(this.selectRowIndex==undefined || this.selectRowIndex < 0){
        this.$notify({
          title: '提示',
          message: '请选择要授权的记录',
          type: 'warning',
          duration: 2000
        })
        return
      }
      let row=this.list[this.selectRowIndex]
      this.dialogGrantVisible = true
      this.privileges=[]
      this.expendkeys=[]
      fetchPrivileges({userId:1}).then(res => {
        this.privileges=res.data
        fetchRolePrivilegeIds({roleId:row.id}).then(r => {
          this.$refs.privilegeTree.setCheckedKeys(r.data);
          //选中的默认展开
          this.expendkeys=r.data
        })
      })
    },
    grant(){
      let row=this.list[this.selectRowIndex]
      let checkedKeys=this.$refs.privilegeTree.getCheckedKeys();
      grantPrivileges({roleId:row.id, privilegeIds:checkedKeys}).then(res => {
        this.$notify({
          title: '成功',
          message: '授权成功',
          type: 'success',
          duration: 2000
        })
        this.dialogGrantVisible = false
      });
    },
    checkNode(node, checkedInfo){
      //选中的节点的key
      let checkedkeys=checkedInfo.checkedKeys!=null ? checkedInfo.checkedKeys : []
      if(checkedkeys.indexOf(node.id) > -1){//选中
        checkedkeys.push(node.id)
        if(node.children!=null && node.children.length>0){
          this.getChildrenKeys(node.children, checkedkeys)
        }

        let pidsStr=node.pids
        if(pidsStr!=null && pidsStr.length>0){
          let pids=pidsStr.split(',')
          pids.forEach(i => checkedkeys.push(i))
        }
      }else{//取消选中
        let childrenKeys=[]
        this.getChildrenKeys(node.children, childrenKeys)
        //直接点如果是选中状态，则取消选中
        childrenKeys.forEach(t => {
          let index = checkedkeys.indexOf(t)
          if(index > -1){
            checkedkeys.splice(index, 1)
          }
        })
      }
      //设置选中
      this.$refs.privilegeTree.setCheckedKeys(checkedkeys);
    },
    getChildrenKeys(children, keys){
      if(children!=null && children.length>0){
        children.forEach(el => {
          keys.push(el.id)
          this.getChildrenKeys(el.children, keys)
        });
      }
    }

  }
}
</script>
<style lang="scss" scoped>

</style>