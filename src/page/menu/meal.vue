<template>
  <div class="container-box">
    <div class="form-box">
      <el-row class="input-box" :gutter="20">
        <!-- 姓名 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">套餐ID：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入套餐ID" size="mini" v-model="select.meal_id"></el-input>
          </el-col>
        </el-col>
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">名称：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入名称" size="mini" v-model="select.meal_name"></el-input>
          </el-col>
        </el-col>
         
        
      </el-row>

      <el-row class="input-box" :gutter="20">
        <!-- 性别选择 -->
        <el-col :span="6" class="input-label">
          <el-col :span="8" class="label">费用：</el-col>
          <el-col :span="16">
            <el-input placeholder="请输入费用" size="mini" type="number" v-model="select.meal_cost"></el-input>
          </el-col>
        </el-col>
        
        <el-button type="primary" @click="selectMealList()">查询</el-button>
        <el-button type="primary" @click="addMealVisible = true">新增</el-button>
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
      <el-table-column prop="meal_id" label="ID" width="80"></el-table-column>
      <el-table-column prop="meal_name" label="名称"></el-table-column>
      <el-table-column prop="meal_introduce" show-overflow-tooltip="true" label="介绍"></el-table-column>
      <el-table-column prop="meal_attention" show-overflow-tooltip="true" label="注意事项"></el-table-column>
      <el-table-column prop="meal_cost" label="费用" width="100"></el-table-column>
      <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="showUpdateDialog(1,scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="showDeleteDialog(1,scope.row)"   type="text" size="small">删除</el-button>
            </template>
       </el-table-column>
    </el-table>

    <!-- 删除提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteMealVisible"
        width="30%"
      :before-close="handleClose">
      <span>删除套餐将会删除与套餐相关的所有项目，是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteMeal()">确 定</el-button>
        <el-button @click="deleteMealVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteProjectVisible"
        width="30%"
      :before-close="handleClose">
      <span>是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteProject()">确 定</el-button>
        <el-button @click="deleteProjectVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加数据 -->
    <el-dialog title="添加套餐" :visible.sync="addMealVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.meal_name" width="50"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <el-input v-model="ruleForm.meal_introduce" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="注意事项" prop="attention">
          <el-input v-model="ruleForm.meal_attention" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="费用" prop="cost">
          <el-input v-model="ruleForm.meal_cost" type="number" ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addMeal()">确认</el-button>
          <el-button @click="addMealVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加数据 -->
    <el-dialog title="修改套餐" :visible.sync="updateMealVisible" width="50%">
      <el-form :model="updateMealData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="updateMealData.meal_name" width="50"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <el-input v-model="updateMealData.meal_introduce" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="注意事项" prop="payment">
          <el-input v-model="updateMealData.meal_attention" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="费用" prop="cost">
          <el-input v-model="updateMealData.meal_cost" type="number" ></el-input>
        </el-form-item>
        <!-- 部门  -->
        <el-form-item label="项目管理" prop="department_name">
          <el-button @click="addProjectVisible = true">新建项目</el-button>
        </el-form-item>

        <el-table
          :header-cell-style="tableHeaderColor"
          :data="projectList"
          size="mini"
          stripe = true
          border
          height="250"
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="project_id" label="ID" width="80"></el-table-column>
          <el-table-column prop="project_name" label="名称"></el-table-column>
          <el-table-column prop="project_introduce" show-overflow-tooltip="true" label="介绍"></el-table-column>
          <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button @click="showUpdateDialog(2,scope.row)" type="text" size="small">修改</el-button>
                  <el-button @click="showDeleteDialog(2,scope.row)"   type="text" size="small">删除</el-button>
                </template>
          </el-table-column>
        </el-table>
        
        <el-form-item>
          <el-button type="primary" @click="updateMeal()">确认</el-button>
          <el-button @click="updateMealVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改数据 -->
    <el-dialog title="添加项目" :visible.sync="addProjectVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.project_name" width="50"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <el-input v-model="ruleForm.project_introduce" type="textarea"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addProject()">确认</el-button>
          <el-button @click="addProjectVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加数据 -->
    <el-dialog title="修改项目" :visible.sync="updateProjectVisible" width="50%">
      <el-form :model="updateProjectData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="updateProjectData.project_name" width="50"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="introduce">
          <el-input v-model="updateProjectData.project_introduce" type="textarea"></el-input>
        </el-form-item>
       
        <el-form-item>
          <el-button type="primary" @click="updateProject()">确认</el-button>
          <el-button @click="updateProjectVisible = false">取消</el-button>
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
      type : 0,  //判断修改弹出框是什么状态 0是默认没有被调用，1是新增，2是修改
      updateMealData : {},
      updateProjectData : {},
      addMealVisible : false,
      updateMealVisible : false,
      addProjectVisible : false,
      updateProjectVisible : false,
      deleteMealVisible : false,
      deleteProjectVisible : false,
      tableData: [],
      ruleForm: {},
      deleteData : '',
      select : {
        meal_name : '',
        meal_cost : '',
        meal_id : ''
      }
    };
  },
  methods: {
    //清空查询框内容
    clearSelect(){
      this.select = {
        meal_name : '',
        meal_cost : '',
        meal_id : ''
      }
      this.selectMealList()
    },

    //判断显示套餐或项目修改对话框
    showUpdateDialog(type,row){
      if(type == 1){
        this.updateMealVisible = true
        this.updateMealData = JSON.parse(JSON.stringify(row))
        this.selectProjectList()
      }

      if(type == 2){
        this.updateProjectVisible = true
        this.updateProjectData = JSON.parse(JSON.stringify(row))
      }
    },

    //显示删除提示框
    showDeleteDialog(type,row){
     if(type == 1){
        this.deleteMealVisible = true
        this.deleteData = row
     }

     if(type == 2){
        this.deleteProjectVisible = true
        this.deleteData = row
     }
    },

    //添加套餐
    addMeal(){
      var url = '/api/meal/add_meal'
      var data = this.ruleForm
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.selectMealList()
          this.addMealVisible = false
          this.ruleForm = {}
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //添加项目
    addProject(){
      var url = '/api/project/add_project'
      var data = this.ruleForm
      data.meal_id = this.updateMealData.meal_id
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.ruleForm = {}
          this.selectProjectList()
          this.addProjectVisible = false
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //更新套餐
    updateMeal(){
      var url = '/api/meal/update_meal'
      var data = this.updateMealData
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.updateMealData = {}
          this.selectMealList()
          this.updateMealVisible = false
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //更新项目
    updateProject(){ 
      var url = '/api/project/update_project'
      var data = this.updateProjectData
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.updateProjectData = {}
          this.selectProjectList()
          this.updateProjectVisible = false
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //删除套餐
    deleteMeal(){
      var url = '/api/meal/delete_meal'
      var data = {
        meal_id : this.deleteData.meal_id
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.selectMealList()
          this.deleteMealVisible = false
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //删除项目
    deleteProject(){
      var url = '/api/project/delete_project'
      var data = {
        project_id : this.deleteData.project_id
      }
      this.gRequest(url,data).then(res => {
        if(res.code == 200){
          this.returnMsg(res.msg)
          this.selectProjectList()
          this.deleteProjectVisible = false
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    },

    //查询所有套餐信息
    selectMealList(){
      this.loading = true
      var url = '/api/meal/select_meal_list_admin'
      var data = this.select
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

    //查询所有项目信息
    selectProjectList(){
      this.loading = true
      var url = '/api/project/select_project'
      var data = {
        meal_id : this.updateMealData.meal_id
      }
      this.gRequest(url,data).then(res => {
        this.loading = false
        if(res.code == 200){
          this.projectList = res.data
        }else{
          this.returnMsg(res.msg,'error')
        }
      })
    }


  },
  watch: {
    DateValue(newval, oldval) {
    }
  },
  created(){
    this.selectMealList()
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
