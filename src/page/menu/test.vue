<template>
  <div class="container-box">
    <div class="form-box">
      <el-row class="input-box" :gutter="20">
        <!-- 姓名 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">体检ID：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入体检ID" size="mini" v-model="select.test_id"></el-input>
          </el-col>
        </el-col>
        <!-- 就诊人ID  -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">就诊人ID：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入就诊人ID" size="mini" v-model="select.patient_id"></el-input>
          </el-col>
        </el-col>

        <!-- 预约日期 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">预约日期：</el-col>
          <el-col :span="16">
            <el-date-picker
              v-model="select.test_date"
              type="date"
              placeholder="选择预约日期">
            </el-date-picker>
          </el-col>
        </el-col>

         
        
      </el-row>

      <el-row class="input-box" :gutter="20">
        <!-- 性别选择 -->
       
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">套餐ID：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入套餐ID" size="mini" v-model="select.meal_id"></el-input>
          </el-col>
        </el-col>
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">预约状态：</el-col>
          <el-col :span="16">
            <el-select size="mini" v-model="select.test_status" placeholder="请选择预约状态">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
      
        <el-button type="primary" @click="selectTestList()">查询</el-button>
        <el-button type="primary" @click="clearSelect">清空</el-button>
      </el-row>

    </div>
    <el-table
      :header-cell-style="tableHeaderColor"
      :data="tableData"
      size="mini"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="test_id" label="ID" width="80"></el-table-column>
      <el-table-column prop="order_time" label="预约体检时的时间"></el-table-column>
      <el-table-column prop="patient_id" label="就诊人ID"></el-table-column>
      <el-table-column prop="test_date" label="预约时间"></el-table-column>
      <el-table-column prop="meal_id" label="套餐ID"></el-table-column>
      <el-table-column prop="test_status" label="预约状态"></el-table-column>
      <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button v-if="scope.row.test_status == '预约成功'" @click="showDialogVisable(2,scope.row)" type="text" size="small">修改</el-button>
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
      >
      <span>是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteDoctor()">确 定</el-button>
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改数据 -->
    <el-dialog title="上传报告" :visible.sync="dialogVisible" width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="上传体检报告" prop="name">
        </el-form-item>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>

        <el-form-item style="margin-top:40px;">
          <el-button type="primary" @click="submitForm()">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>



</template>
<script>
import pagination from "common/pagination";
// import oss from "http://gosspublic.alicdn.com/aliyun-oss-sdk-4.4.4.min.js";
export default {
  data() {
    return {
      status : [
        {label : '预约成功',value : 0},
        {label : '预约取消',value : 1},
        {label : '预约过期',value : 3}
      ],
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
        test_id : '',
        test_date : '',
        patient_id : '',
        test_status : '',
        meal_id : ''
      }
    };
  },
  methods: {

    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    
    handlePreview(file) {
      console.log(file);
    },
    
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },

    //清空查询框内容
    clearSelect(){
      this.select = {
        test_id : '',
        test_date : '',
        patient_id : '',
        test_status : '',
        meal_id : ''
      }
      this.selectTestList()
    },

    //弹出新增或更新就诊人弹窗
    showDialogVisable(type,row={
      doctor_name : '',
      doctor_sex : '',
      doctor_introduce : '',
      doctor_good : '',
      doctor_title : '',
      department_id : '',
      office_id : '',
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


    

    
    
    //查询所有体检信息
    selectTestList(){
      this.loading = true
      var url = '/api/test/select_test_list_admin' 
      var data = {}
      data.test_id = this.select.test_id
      data.test_date = this.select.test_date
      data.patient_id = this.select.patient_id
      data.test_status = this.select.test_status
      data.meal_id = this.select.meal_id
      if(data.test_date != ''){
         data.test_date = this.turnDateToTime(data.test_date)
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

  },
  watch: {
    DateValue(newval, oldval) {
    }
  },
  created(){
    this.selectTestList()
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
