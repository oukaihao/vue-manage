<template>
  <div class="my-login">
      
    <div class="my-form">
        <h1>用户登录</h1>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :label-position="'top'"
        
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="password" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" class="submitbtn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
          ruleForm:{
              username:'',
              password:''
          },
          rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 6 个字符', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
          ],
      }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      
    }
};
</script>

<style lang="less" scope>
html,
body {
  height: 100%;
}
.my-login {
  height: 100%;
  background-color: rgb(50, 65, 82);
  display: flex;
  justify-content: center;
  align-items: center;
  .my-form {
    width: 450px;
    height: 400px;
    background-color: aliceblue;
    padding: 40px;
    h1{
        margin-bottom: 30px;
    }
    .submitbtn{
        width: 100%;
        margin-top: 30px;
    }
    
  }
}
</style>

