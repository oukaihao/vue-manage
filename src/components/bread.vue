<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="my-bread">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{first}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{second}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
    props:['first','second']
};
</script>

<style lang="less" scoped>
.my-bread {
  font-size: 15px;
  height: 45px;
  line-height: 45px;
  padding-left: 15px;
  background-color: #d3dce6;
}
</style>