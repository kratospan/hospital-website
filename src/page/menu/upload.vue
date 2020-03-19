<template>
  <div class="upload-info">
    <div>
    <el-upload
        class="avatar-uploade"
        :multiple="true"
        :action="actionPath"
        accept="image/jpeg,image/gif,image/png,image/bmp"
        :before-upload="beforeAvatarUpload"
        :data="postData"
        :on-success="handleAvatarSuccess">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

      <div>
        <img class="pic-box" :src="uploadPicUrl" v-if="uploadPicUrl">
      </div>
    </div>
    <div>
      <el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button>
      <el-button type="info" plain >取消</el-button>
    </div>
  </div>
</template>

<script>
import {genUpToken} from "../../api/qianniu";
export default {
  data() {
    return {
        token : '',
        actionPath:'https://upload-z2.qiniup.com',
        imageUrl: '',
        postData : {}
    };
  },
  created() {
      var policy = {};
      var bucketName = 'selfvisitsystem';
      var AK ='aDUdGI40J_30bUFMbPEXRGB89wQWHPy_pGzePIh7';
      var SK = 'YzCFt2vw0vmscYGTKZbolVUjEaPJg2Z49IBxtpQI';
      var deadline = Math.round(new Date().getTime() / 1000) + 3600;
      policy.scope = bucketName;
      policy.deadline = deadline;
      var token=genUpToken(AK, SK, policy);
      this.postData.token=token;
  },
  mounted() {

  },
  methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = 'http://q7fb5tf1c.bkt.clouddn.com/'+ res.key
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
 
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
  }
};
</script>