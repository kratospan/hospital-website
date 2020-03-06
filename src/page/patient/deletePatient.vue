<template>
  <div class="container-box">
    <div class="form-box">
      <el-row class="input-box" :gutter="20">
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
        <el-button type="primary">查询</el-button>
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
              <el-button @click="handleClickUpdate(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="deleteDialogVisible = true"   type="text" size="small">删除</el-button>
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
        <el-button type="primary" @click="deleteDialogVisible = false">确 定</el-button>
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 修改数据 -->
    <el-dialog title="修改就诊人信息" :visible.sync="updateDialogVisible" width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.patient_name" width="50"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="name">
          <el-input v-model="ruleForm.patient_card"></el-input>
        </el-form-item>
        <el-form-item label="出生年月" prop="name">
          <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.patient_birth" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="patient_sex">
          <el-select v-model="ruleForm.patient_sex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="name">
          <el-input v-model="ruleForm.patient_phone"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="patient_sex">
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
          <el-button @click="updateDialogVisible = false">取消</el-button>
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
      updateDialogVisible : false,
      totalPage: 100,
      tableData: [
        {
          patient_name : '潘伟健',
          patient_sex : '男',
          patient_card : '440921199806182135',
          patient_phone : '155211686841',
          patient_birth : '2020-02-03',
          patient_id : '2',
          patient_relationship : '自己',
          user_id : '9',
        },
        {
          patient_name : '潘伟健',
          patient_sex : '男',
          patient_card : '440921199806182135',
          patient_phone : '155211686841',
          patient_birth : '2020-02-03',
          patient_id : '2',
          patient_relationship : '自己',
          user_id : '9',
        },
      ],
      ruleForm: '',
      select : {
        patient_name : '',
        patient_phone : '',
        patient_sex : '',
        patient_card : ''
      }
    };
  },
  methods: {
    handleClickUpdate(row){
      this.updateDialogVisible = 1
      this.ruleForm = row
    },
    clearSelect(){
      this.select = {
        patient_name : '',
        patient_phone : '',
        patient_sex : '',
        patient_card : ''
      }
    },
    receivePageSize(val) {
      console.log(val);
    },
    receiveCurrentPage(val) {
      console.log(val);
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #F7F6Fd;color: #B6B5C2;font-weight: 500;";
      }
    },

    gRequest(){
      var request = require('request');
    }
  },
  watch: {
    DateValue(newval, oldval) {
      console.log(newval);
      console.log(oldval);
    }
  },
  components: {
    pagination
  }
};
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
