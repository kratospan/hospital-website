<template>
  <div class="container-box">
    <div class="form-box">
      <el-row class="input-box" :gutter="20">
        <!-- 姓名 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">医生姓名：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入姓名" size="mini" v-model="select.doctor_name"></el-input>
          </el-col>
        </el-col>
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">就诊人姓名：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入就诊人姓名" size="mini" v-model="select.patient_name"></el-input>
          </el-col>
        </el-col>
         <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">预约时间：</el-col>
          <el-col :span="16">
            <el-date-picker
              v-model="select.register_date"
              type="date"
              placeholder="选择预约时间">
            </el-date-picker>
          </el-col>
        </el-col>
        
      </el-row>

      <el-row class="input-box" :gutter="20">
        <!-- 性别选择 -->
       
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">预约时段：</el-col>
          <el-col :span="16">
            <el-select size="mini" v-model="select.register_time" placeholder="请选择预约时段">
              <el-option label="08:00-09:00" value="0"></el-option>
              <el-option label="09:00-10:00" value="1"></el-option>
              <el-option label="10:00-11:00" value="2"></el-option>
              <el-option label="14:00-15:00" value="3"></el-option>
              <el-option label="15:00-16:00" value="4"></el-option>
              <el-option label="16:00-17:00" value="5"></el-option>
              <!-- 0是主任医师，1是副主任医师，2是主治医师，3是住院医师 -->
            </el-select>
          </el-col>
        </el-col>
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">预约状态：</el-col>
          <el-col :span="16">
            <el-select size="mini" v-model="select.register_status" placeholder="请选择预约状态">
              <el-option label="预约成功" value="0"></el-option>
              <el-option label="预约取消" value="1"></el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-button type="primary" @click="selectRegisterList()">查询</el-button>
        <el-button type="primary" @click="clearSelect">清空</el-button>
      </el-row>

    </div>
    <el-table
      :header-cell-style="tableHeaderColor"
      :data="tableData"
      size="mini"
      stripe = true
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="register_id" label="ID" width="80"></el-table-column>
      <el-table-column prop="doctor_name" label="医生姓名" width="80"></el-table-column>
      <el-table-column prop="patient_name" label="就诊人姓名"></el-table-column>
      <el-table-column show-overflow-tooltip="true" prop="register_date" label="预约时间"></el-table-column>
      <el-table-column prop="register_time" label="预约时段"></el-table-column>
      <el-table-column prop="register_status" label="预约状态"></el-table-column>
      <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="showDeleteDialog(scope.row)"   type="text" size="small">删除</el-button>
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
      <span>是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteRegister()">确 定</el-button>
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改数据 -->
    <el-dialog title="医生信息" :visible.sync="dialogVisible" width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.doctor_name" width="50"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <el-input v-model="ruleForm.doctor_introduce"></el-input>
        </el-form-item>
        <el-form-item label="挂号费用" prop="payment">
          <el-input v-model="ruleForm.doctor_payment" type="number"></el-input>
        </el-form-item>
        <!-- <el-form-item label="出生年月" prop="name">
          <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.doctor_birth" style="width: 100%;"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="性别" prop="doctor_sex">
          <el-select v-model="ruleForm.doctor_sex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- 部门  -->
        <el-form-item label="部门" prop="department_name">
          <el-select v-model="ruleForm.department_id" @change="handleChange" placeholder="请选择部门">
            <el-option
                v-for="item in departmentList2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <!-- 科室  -->
        <el-form-item label="科室" prop="office_name">
          <el-select v-model="ruleForm.office_id" placeholder="请选择科室">
            <el-option
                v-for="item in officeList2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="擅长" prop="good">
          <el-input v-model="ruleForm.doctor_good"></el-input>
        </el-form-item>
        <el-form-item label="头衔" prop="doctor_title">
          <el-select v-model="ruleForm.doctor_title" placeholder="请选择头衔">
            <el-option label="主任医生" value="0"></el-option>
            <el-option label="副主任医生" value="1"></el-option>
            <el-option label="主治医师" value="2"></el-option>
            <el-option label="住院医师" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
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
      loading : false,
      departmentList : [],
      officeList : [],
      departmentList2 : [],
      officeList2 : [],
      deleteDialogVisible: false,
      dialogVisible : false,
      totalPage: 100,
      type : 0,  //判断修改弹出框是什么状态 0是默认没有被调用，1是新增，2是修改
      tableData: [],
      ruleForm: {},
      deleteData : '',
      select : {
        register_id : '',
        register_status : '',
        patient_name : '',
        doctor_name : '',
        register_time : '',
        register_date : ''
      }
    };
  },
  methods: {
    //清空查询框内容
    clearSelect(){
      this.select = {
        register_id : '',
        register_status : '',
        patient_name : '',
        doctor_name : '',
        register_time : '',
        register_date : ''
      }
      this.selectRegisterList()
    },

    //弹出新增或更新就诊人弹窗
    showDialogVisable(type,row={
      register_id : '',
      register_status : '',
      patient_name : '',
      doctor_name : '',
      register_time : '',
      register_date : ''
    }){
      this.type = type
      this.ruleForm = row
      this.dialogVisible = 1
      if(this.type == 2){
        this.handleChange(this.ruleForm.department_id)
      }
    },

    //提交表单
    submitForm(){
      if(this.type == 1){
        this.addDoctor()
      }

      if(this.type == 2){
        if(this.ruleForm.doctor_payment < 0){
          this.returnMsg('挂号费用不能小于0','error')
          return
        }
        this.updateDoctor()
      }
    },

    //显示删除提示框
    showDeleteDialog(row){
      this.deleteDialogVisible = true
      this.deleteData = row
    },

    //删除挂号记录
    deleteRegister(){
      var url = '/api/register/delete_register'
      var data = {
        register_id : this.deleteData.register_id
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.deleteDialogVisible = false
          this.selectRegisterList()
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //修改医生信息
    updateDoctor(){
      var url = '/api/doctor/update_doctor'
      var data = JSON.parse(JSON.stringify(this.ruleForm))
      delete data.office_name
      delete data.department_name
      if(data.doctor_sex == '男'){
        data.doctor_sex = 1
      }else{
        data.doctor_sex = 0
      }
      switch (data.doctor_title){
        case '主任医师':
          data.doctor_title = 0
        case '副主任医师':
          data.doctor_title = 1
        case '主治医师':
          data.doctor_title = 2
        case '住院医师':
          data.doctor_title = 3
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.dialogVisible= false
          this.selectDoctorList()
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },


    //新增医生信息
    addDoctor(){
      var url = '/api/doctor/add_doctor'
      var data = this.ruleForm
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.dialogVisible= false
          this.selectDoctorList()
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },
    
    //查询所有挂号信息
    selectRegisterList(){
      this.loading = true
      var url = '/api/register/select_register_list_admin'
      var data = {}
      data.doctor_name = this.select.doctor_name
      data.patient_name = this.select.patient_name
      data.register_date = this.select.register_date
      data.register_time = this.select.register_time
      data.register_status = this.select.register_status
      if(this.select.register_date != ''){
        data.register_date = (this.select.register_date.getTime())/1000
      }
      this.gRequest(url,data).then(res => {
        this.loading = false
        if(res.code == 200){
          // this.returnMsg(res.msg)
          this.tableData = res.data
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //查询部门信息
    selectDepartmentList(){
      this.loading = true
      var url = '/api/department/select_department'
      var data = ''
      this.gRequest(url,data).then(res => {
        this.loading = false
        if(res.code == 200){
          var list = res.data
          var arr2 = []
          var arr = []
          list.forEach(function(element){
            var item = {'label':element.department_name,'value':element.department_name}
            var item2 = {'label':element.department_name,'value':element.department_id}
            arr.push(item)
            arr2.push(item2)
          });
          this.departmentList = arr
          this.departmentList2 = arr2
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //查询科室信息
    selectOfficeList(){
      this.loading = true
      var url = '/api/office/select_office_list_admin'
      var data = ''
      this.gRequest(url,data).then(res => {
        this.loading = false
        if(res.code == 200){
          var list = res.data
          var arr = []
          list.forEach(function(element){
            var item = {'label':element.office_name,'value':element.office_name}
            arr.push(item)
          });
          this.officeList = arr
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //根据部门查询科室信息
    handleChange(value){
      this.ruleForm.office_id = ''
      var url = '/api/office/select_office'
      var data = {
        department_id : value
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          var list = res.data
          var arr = []
          list.forEach(function(element){
            var item = {'label':element.office_name,'value':element.office_id}
            arr.push(item)
          });
          this.officeList2 = arr
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
      // alert('选择的部门是:',value)
    }
  },
  watch: {
    DateValue(newval, oldval) {
    }
  },
  created(){
    // this.selectOfficeList()
    this.selectRegisterList()
    // this.selectDepartmentList()
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
