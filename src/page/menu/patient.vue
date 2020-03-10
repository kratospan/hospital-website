<template>
  <div class="container-box">
    <div class="form-box">
      <el-row class="input-box" :gutter="20">
        <!-- 姓名 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">就诊人ID：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入就诊人ID" size="mini" v-model="select.patient_id"></el-input>
          </el-col>
        </el-col>
        <!-- 姓名 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">姓名：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入姓名" size="mini" v-model="select.patient_name"></el-input>
          </el-col>
        </el-col>
        <!-- 手机号码 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">手机号码：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入手机号码" size="mini" v-model="select.patient_phone" maxlength="11"></el-input>
          </el-col>
        </el-col>
        <el-button type="primary" @click="selectPatientList2">查询</el-button>
        <!-- <el-button type="primary" @click="showDialogVisable(1)">新增</el-button> -->
      </el-row>

      <el-row class="input-box" :gutter="20">
        <!-- 身份证号码 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">身份证号码：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入身份证号码" size="mini" v-model="select.patient_card" maxlength="18"></el-input>
          </el-col>
        </el-col>
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">性别：</el-col>
          <el-col :span="16">
            <el-select size="mini" v-model="select.patient_sex" placeholder="请选择性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="0"></el-option>
            </el-select>
          </el-col>
        </el-col>
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
      <el-table-column prop="patient_id" label="ID" width="80"></el-table-column>
      <el-table-column prop="patient_name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="patient_card" label="身份证号码"></el-table-column>
      <el-table-column prop="patient_birth" label="出生年月"></el-table-column>
      <el-table-column prop="patient_sex" label="性别"></el-table-column>
      <el-table-column prop="patient_phone" label="手机号码"></el-table-column>
      <el-table-column prop="patient_relationship" label="与用户的关系"></el-table-column>
      <el-table-column prop="user_id" label="用户ID"></el-table-column>
      <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="showDialogVisable(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="showDeleteDialog(scope.row)"   type="text" size="small">删除</el-button>
            </template>
       </el-table-column>
    </el-table>
    <div align="left" style="margin-left: 60%; margin-top: 15px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage1"
        :page-size="10"
        layout="total, prev, pager, next"
        :total = totalPage>
      </el-pagination>
    </div>

    <!-- 删除提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
        width="30%"
      :before-close="handleClose">
      <span>是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deletePatient()">确 定</el-button>
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改数据 -->
    <el-dialog title="就诊人信息" :visible.sync="dialogVisible" width="30%">
      <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="patient_name">
          <el-input v-model="ruleForm.patient_name" width="50"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="patient_card">
          <el-input v-model="ruleForm.patient_card"></el-input>
        </el-form-item>
        <el-form-item label="出生年月" prop="patient_birth">
          <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.patient_birth" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="patient_sex">
          <el-select v-model="ruleForm.patient_sex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="patient_phone">
          <el-input v-model="ruleForm.patient_phone"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="patient_relationship">
          <el-select v-model="ruleForm.patient_relationship" placeholder="请选择与用户的关系">
            <el-option label="自己" value="自己"></el-option>
            <el-option label="父母" value="父母"></el-option>
            <el-option label="子女" value="子女"></el-option>
            <el-option label="夫妻" value="夫妻"></el-option>
            <el-option label="亲属" value="亲属"></el-option>
            <el-option label="朋友" value="朋友"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
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
      deleteDialogVisible: false,
      dialogVisible : false,
      totalPage: 100,
      type : 0,  //判断修改弹出框是什么状态 0是默认没有被调用，1是新增，2是修改
      tableData: [],
      ruleForm: {},
      select : {
        patient_name : '',
        patient_phone : '',
        patient_sex : '',
        patient_card : '',
        patient_id : ''
      },
      loading : false,
      deleteData : ''
    };
  },
  methods: {
    //清空查询框内容
    clearSelect(){
      this.select = {
        patient_name : '',
        patient_phone : '',
        patient_sex : '',
        patient_card : '',
        patient_id : ''
      }
    },

    //显示删除提示框
    showDeleteDialog(row){
      this.deleteData = row
      this.deleteDialogVisible = true
    },

    //删除就诊人
    deletePatient(){
      var url = '/api/patient/delete_patient'
      var data = {
        'patient_id' : this.deleteData.patient_id
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.deleteDialogVisible = false
          this.selectPatientList()
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    selectPatient(){
      var url = '/api/patient/select_patient'
      var data = this.select
      this.gRequest2(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //弹出新增或更新就诊人弹窗
    showDialogVisable(row){
      let that = this
      that.ruleForm = JSON.parse(JSON.stringify(row));
      this.dialogVisible = 1
    },

    //提交表单
    submitForm(){
      if(this.type == 1){
        this.addPatient()
      }else{
        this.updatePatient()
      }
    },

    //新增就诊人
    addPatient(){
      var url = '/api/patient/add_patient'
      var data = this.ruleForm
      this.gRequest2(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //修改就诊人
    updatePatient(){
      var url = '/api/patient/update_patient'
      var data = this.ruleForm
      this.gRequest2(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //查询所有就诊人的信息
    selectPatientList(){
      this.loading = true
      var url = '/api/patient/select_patient_list_admin'
      var data = this.ruleForm
      this.gRequest(url,data).then(res => {
        this.loading = false
        if(res.code == 200){
          // this.returnMsg(res.msg)
          this.tableData = res.data
          this.totalPage = res.count
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //根据用户的查询条件查询就诊人列表
    selectPatientList2(){
      this.loading = true
      var url = '/api/patient/select_patient_list_admin_by'
      var data = this.select
      this.gRequest(url,data).then(res => {
        this.loading = false
        if(res.code == 200){
          // this.returnMsg(res.msg)
          this.tableData = res.data
          this.totalPage = res.count
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

  },
  watch: {
    DateValue(newval, oldval) {
      // console.log(newval);
      // console.log(oldval);
    }
  },
  created(){
    // this.addPatient()
    this.selectPatientList()
  },
  components: {
    pagination
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/them.scss";
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
