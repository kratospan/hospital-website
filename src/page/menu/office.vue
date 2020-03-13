<template>
  <div class="container-box">
    <div class="form-box">
      <el-row class="input-box" :gutter="20">
        
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">部门名称：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入部门名称" size="mini" v-model="select.department_name"></el-input>
          </el-col>
        </el-col>
         
         <el-button type="primary" @click="selectDepartmentList()">查询</el-button>
        <el-button type="primary" @click="showAddDialog = true">新增部门</el-button>
        <el-button type="primary" @click="clearSelect">清空</el-button>
        
      </el-row>
    </div>

    <el-table
      :header-cell-style="tableHeaderColor"
      :data="tableData"
      size="mini"
      stripe = true
      border
      height="500"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="department_id" label="部门ID" width="80"></el-table-column>
      <el-table-column prop="department_name" label="部门名称"></el-table-column>
      <el-table-column prop="department_introduce" show-overflow-tooltip="true" label="部门介绍"></el-table-column>
      <el-table-column prop="department_phone" label="部门电话"></el-table-column>
      <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="showUpdateDialog(scope.row)"   type="text" size="small">编辑</el-button>
              <el-button @click="showDeleteDialog(1,scope.row)"   type="text" size="small">删除</el-button>
            </template>
       </el-table-column>
    </el-table>
    <!-- <div align="left" style="margin-left: 60%; margin-top: 15px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-size="10"
        layout="total, prev, pager, next"
        :total = totalPage>
      </el-pagination>
    </div> -->

    <!-- 删除提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
        width="30%"
      :before-close="handleClose">
      <span>删除部门会将部门下的所有科室和相关信息删除，是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteDepartment()">确 定</el-button>
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 删除科室提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteOfficeVisible"
        width="30%"
      :before-close="handleClose">
      <span>是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteOffice()">确 定</el-button>
        <el-button @click="deleteOfficeVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加数据 -->
    <el-dialog title="新增部门" :visible.sync="showAddDialog" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="部门名称" prop="date">
          <el-input size="mini" v-model="ruleForm.department_name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="time">
          <el-input type="number" v-model="ruleForm.department_phone"></el-input>
        </el-form-item>
        <el-form-item label="部门介绍" prop="time">
          <el-input type="textarea" v-model="ruleForm.department_introduce"></el-input>
        </el-form-item>
    
      
        <el-form-item>
          <el-button type="primary" @click="addDepartment()">确认</el-button>
          <el-button @click="cancleAddDepartment()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改部门 -->
    <el-dialog title="编辑部门" :visible.sync="updateDialogVisable" width="50%">
      <el-form :model="updateData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="部门名称" prop="date">
          <el-input size="mini" v-model="updateData.department_name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="time">
          <el-input type="number" v-model="updateData.department_phone"></el-input>
        </el-form-item>
        <el-form-item label="部门介绍" prop="time">
          <el-input type="textarea" v-model="updateData.department_introduce"></el-input>
        </el-form-item>
       
        <el-form-item label="科室：" prop="date">
          <el-button @click="addOffice = true"   type="text" size="">新增科室</el-button>
        </el-form-item>
        
        <el-table
          :header-cell-style="tableHeaderColor"
          :data="officeList"
          size="mini"
          stripe = true
          border
          height="250"
          style="width: 95%;"
          v-loading="loading"
        >
        <el-table-column prop="office_id" label="科室ID" width="80"></el-table-column>
        <el-table-column prop="office_name" label="科室名称"></el-table-column>
        <el-table-column prop="office_introduce" show-overflow-tooltip="true" label="科室介绍"></el-table-column>
        <el-table-column prop="office_phone" label="科室电话"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="toUpdateOffice(scope.row)"   type="text" size="small">修改</el-button>
            <el-button @click="showDeleteDialog(2,scope.row)"   type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
        </el-table>

        <el-form-item style="margin-top:20px;">
          <el-button type="primary" @click="updateDapartment2()">确认</el-button>
          <el-button @click="updateDialogVisable = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加数据 -->
    <el-dialog title="添加科室" :visible.sync="addOffice" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="科室名称" prop="date">
          <el-input size="mini" v-model="ruleForm.office_name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="time">
          <el-input type="number" v-model="ruleForm.office_phone"></el-input>
        </el-form-item>
        <el-form-item label="科室介绍" prop="time">
          <el-input type="textarea" v-model="ruleForm.office_introduce"></el-input>
        </el-form-item>
    
      
        <el-form-item>
          <el-button type="primary" @click="addOfficeData()">确认</el-button>
          <el-button @click="addOffice = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改数据 -->
    <el-dialog title="修改科室" :visible.sync="updateOffice" width="50%">
      <el-form :model="updateData2" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="科室名称" prop="date">
          <el-input size="mini" v-model="updateData2.office_name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="time">
          <el-input type="number" v-model="updateData2.office_phone"></el-input>
        </el-form-item>
        <el-form-item label="科室介绍" prop="time">
          <el-input type="textarea"  v-model="updateData2.office_introduce"></el-input>
        </el-form-item>
    
      
        <el-form-item>
          <el-button type="primary" @click="updateOffice2()">确认</el-button>
          <el-button @click="updateOffice = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>



</template>
<script>
import pagination from "common/pagination";
export default {
  data() {
    return {
      updateData2 : {},
      deleteOfficeVisible : false,
      updateData : [],
      addOffice : false,
      showAddDialog : false,
      updateDialogVisable : false,
      updateOffice : false,
      loading : false,
      officeList : [],
      deleteDialogVisible: false,
      dialogVisible : false,
      tableData: [],
      ruleForm: {},
      deleteData : '',
      select : {
        department_id : '',
        department_name : '',
        office_name : '',
        office_id : ''
      }
    };
  },
  methods: {
    //清空查询框内容
    clearSelect(){
      this.select = {
      }
      this.selectDepartmentList()
    },

    updateOffice2(){
      var url = '/api/office/update_office'
      var data = this.updateData2
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.updateOffice = false
          this.selectOfficeList()
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    updateDapartmentForm(){
      var url = '/api/department/update_department'
      var data = this.updateData
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.deleteDialogVisible = false
          this.selectDepartmentList()
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //删除部门
    deleteDepartment(){
      var url = '/api/department/delete_department'
      var data = {
        department_id : this.deleteData.department_id
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.deleteDialogVisible = false
          this.selectDepartmentList()
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    cancleAddDepartment(){
      this.showAddDialog = false
      this.ruleForm = {}
    },

    toUpdateOffice(row){
      this.updateData2 = JSON.parse(JSON.stringify(row))
      this.updateOffice = true
    },

    showUpdateDialog(row){
      this.updateData = JSON.parse(JSON.stringify(row))
      this.updateDialogVisable = true
      this.selectOfficeList()
    },

    

    //弹出新增或更新就诊人弹窗
    showDialogVisable(type,row={
      schedul_time : '',
      schedul_date : '',
      doctor_id : '',
      office_id : ''
    }){
      this.selectOfficeList2()
      this.type = type
      this.ruleForm = row
      this.dialogVisible = 1
      if(this.type == 2){

      }
    },

    //提交表单
    submitForm(){
      
    },

    addDepartment(){
      var url = '/api/department/add_department'
      var data = this.ruleForm
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.deleteDialogVisible = false
          this.showAddDialog = false
          this.selectDepartmentList()
          this.ruleForm = {}
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    updateDapartment2(){
      var url = '/api/department/update_department'
      var data = this.updateData
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.updateDialogVisable = false
          this.selectDepartmentList()
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    addOfficeData(){
      var url = '/api/office/add_office'
      var data = this.ruleForm
      data.department_id = this.updateData.department_id
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.addOffice = false
          this.selectOfficeList()
          this.ruleForm = {}
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //显示删除提示框
    showDeleteDialog(type,row){
      if(type == 1){
        this.deleteDialogVisible = true
        this.deleteData = row
      }

      if(type == 2){
        this.deleteOfficeVisible = true
        this.deleteData = row
      }
    },

    deleteOffice(){
      var url = '/api/office/delete_office'
      var data = {
        office_id : this.deleteData.office_id
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.deleteOfficeVisible = false
          this.selectOfficeList()
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },


    //查询部门信息
    selectDepartmentList(){
      this.loading = true
      var url = '/api/department/select_department_list_admin'
      var data = this.select
      this.gRequest(url,data).then(res => {
        this.loading = false
        if(res.code == 200){
          this.tableData = res.data
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    

    //查询科室信息
    selectOfficeList(){
      this.loading = true
      var url = '/api/office/select_office'
      var data = {
        department_id : this.updateData.department_id
      }
      this.gRequest(url,data).then(res => {
        this.loading = false
        if(res.code == 200){
          this.officeList = res.data
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //查询部门信息

  },
  watch: {
    DateValue(newval, oldval) {
    }
  },
  created(){
    // this.selectSchedulList()
    this.selectDepartmentList()
    // this.selectDoctorList()
  },
  components: {
    pagination
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/them.scss";
  .el-tooltip__popper{max-width:20%;}
  .el-tooltip__popper,.el-tooltip__popper.is-dark{
    background:#f5f5f5 !important;
    color: #303133 !important;
  }
.container-box {
  .form-box {
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    .input-box {
      margin-bottom: 20px;
    }
    .input-label div {
      padding: 0px !important;
    }
    .input-label .label {
      margin-top: 4px;
    }
  }
  .button-box {
    margin: 50px;
  }
}
</style>
