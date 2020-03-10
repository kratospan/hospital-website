<template>
  <div class="container-box">
    <div class="form-box">
      <el-row class="input-box" :gutter="20">
        <!-- 姓名 -->
        <el-col :span="7" class="input-label">
          <el-col :span="6" class="label">排班时间：</el-col>
          <el-col :span="16">
            <el-date-picker
              v-model="select.schedul_date"
              type="date"
              placeholder="选择排班时间">
            </el-date-picker>
          </el-col>
        </el-col>
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">医生：</el-col>
          <el-col :span="16">
            <el-select size="mini"  v-model="select.doctor_name" placeholder="请选择医生">
              <el-option
                v-for="item in doctorList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
         <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">排班时段：</el-col>
          <el-col :span="16">
            <el-select size="mini" v-model="select.schedul_time" placeholder="请选择排班时段">
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
        
      </el-row>

      <el-row class="input-box" :gutter="20">
        <!-- 性别选择 -->
       
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">预约状态：</el-col>
          <el-col :span="16">
            <el-select size="mini" v-model="select.is_book" placeholder="请选择排班状态">
              <el-option label="正常排班" value="正常排班"></el-option>
              <el-option label="已被预约" value="已被预约"></el-option>
            </el-select>
          </el-col>
        </el-col>
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">科室：</el-col>
          <el-col :span="16">
            <el-select size="mini" v-model="select.office_name" placeholder="请选择科室">
              <el-option
                v-for="item in officeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
        <!-- 部门 -->
        
        <el-button type="primary" @click="selectSchedulList()">查询</el-button>
        <el-button type="primary" @click="showDialogVisable(1)">新增</el-button>
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
      <el-table-column prop="schedul_id" label="ID" width="80"></el-table-column>
      <el-table-column prop="schedul_date" label="排班时间"></el-table-column>
      <el-table-column prop="doctor_name" label="医生"></el-table-column>
      <el-table-column prop="schedul_time" label="排班时段"></el-table-column>
      <el-table-column prop="is_book" label="预约状态"></el-table-column>
      <el-table-column prop="office_name" label="科室"></el-table-column>
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
        <el-button type="primary" @click="deleteSchedul()">确 定</el-button>
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改数据 -->
    <el-dialog title="排班信息" :visible.sync="dialogVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="排班时间" prop="date">
          <el-date-picker
              v-model="ruleForm.schedul_date"
              type="date"
              placeholder="选择排班时间">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="排班时段" prop="time">
          <el-select size="mini" v-model="ruleForm.schedul_time" placeholder="请选择排班时段">
              <el-option label="08:00-09:00" value="0"></el-option>
              <el-option label="09:00-10:00" value="1"></el-option>
              <el-option label="10:00-11:00" value="2"></el-option>
              <el-option label="14:00-15:00" value="3"></el-option>
              <el-option label="15:00-16:00" value="4"></el-option>
              <el-option label="16:00-17:00" value="5"></el-option>
            </el-select>
        </el-form-item>



        <!-- 科室  -->
        <el-form-item label="科室" prop="office_name">
          <el-select v-model="ruleForm.office_id" @change="handleChange" placeholder="请选择科室">
            <el-option
                v-for="item in officeList2"
                :key="item.value"
                :label="item.label"
                
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>

        <!-- 选择医生 -->
         <el-form-item label="医生" prop="doctor_id">
          <el-select v-model="ruleForm.doctor_id" placeholder="请选择医生">
            <el-option
                v-for="item in addDoctorList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
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
      addDoctorList : '',
      loading : false,
      officeList : [],
      officeList2 : [],
      officeList2 : [],
      deleteDialogVisible: false,
      dialogVisible : false,
      type : 0,  //判断修改弹出框是什么状态 0是默认没有被调用，1是新增，2是修改
      tableData: [],
      ruleForm: {},
      deleteData : '',
      doctorList : '',
      select : {
        schedul_time : '',
        schedul_date : '',
        doctor_name : '',
        is_book : '',
        office_name : ''
      }
    };
  },
  methods: {
    //清空查询框内容
    clearSelect(){
      this.select = {
        schedul_time : '',
        schedul_date : '',
        doctor_name : '',
        is_book : '',
        office_name : ''
      }
      this.selectSchedulList()
    },

    handleChange(value){
      this.ruleForm.doctor_id = ''
      var url = '/api/doctor/select_doctor_list_by'
      var data = {
        office_id : value
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          var arr = []
          var data = res.data
          data.forEach(element => {
            var item = {label:element.doctor_name,value:element.doctor_id}
            arr.push(item)
          });
          this.addDoctorList = arr
          console.log(this.addDoctorList)
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
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
      if(this.type == 1){
        this.addSchedul()
      }

      if(this.type == 2){

      }
    },

    addSchedul(){
      var url = '/api/schedul/add_schedul'
      if(this.ruleForm.schedul_date != ''){
        var date = this.ruleForm.schedul_date.getTime()/1000
        if(date < Math.round(new Date().getTime()/1000)){
          this.returnMsg('请选择正确的排班时间','error')
          return
        }
        
      }else{
        var date = ''
      }
      var data = {
         schedul_date : date,
         office_id : this.ruleForm.office_id,
         doctor_id : this.ruleForm.doctor_id,
         schedul_time : this.ruleForm.schedul_time,
         is_book : 0
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.dialogVisible = false
          this.selectSchedulList()
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //显示删除提示框
    showDeleteDialog(row){
      this.deleteDialogVisible = true
      this.deleteData = row
    },

    //删除医生
    deleteSchedul(){
      var url = '/api/schedul/delete_schedul'
      var data = {
        schedul_id : this.deleteData.schedul_id
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.deleteDialogVisible = false
          this.selectSchedulList()
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
      var url = '/api/schedul/add_schedul'
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
    
    //查询所有排班信息
    selectSchedulList(){
      this.loading = true
      var url = '/api/schedul/select_schedul_list_admin'
      var data = {}
      data.is_book = this.select.is_book
      if(this.select.is_book == '正常排班') data.is_book = 0
      if(this.select.is_book == '已被预约') data.is_book = 1
      data.schedul_date = this.select.schedul_date
      data.doctor_name = this.select.doctor_name
      data.schedul_time = this.select.schedul_time
      data.office_name = this.select.office_name
      if(data.schedul_date != '') data.schedul_date = (data.schedul_date.getTime())/1000
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

    //查询医生的所有信息
    selectDoctorList(){
      var url = '/api/doctor/select_doctor_list_admin'
      var data = ''
      this.gRequest(url,data).then(res => {
        var arr = []
        if(res.code == 200){
          var data = res.data
          data.forEach(element => {
            var item = {label : element.doctor_name,value : element.doctor_name}
            arr.push(item)
          });
          this.doctorList = arr
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

    //查询科室信息
    selectOfficeList2(){
      this.loading = true
      var url = '/api/office/select_office_list_admin'
      var data = ''
      this.gRequest(url,data).then(res => {
        this.loading = false
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
    },
  },
  watch: {
    DateValue(newval, oldval) {
    }
  },
  created(){
    this.selectSchedulList()
    this.selectOfficeList()
    this.selectDoctorList()
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
