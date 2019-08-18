<template>
  <el-container class="my-container">
    <el-header class="my-header">
      <img src="../assets/img/logo.png" alt />
      <h2>电商后台管理系统</h2>
      <a href="#" @click.prevent="out">退出</a>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu class="el-menu-vertical-demo" :unique-opened="true" router>
          <el-submenu v-for="(item,index) in menuslist" :key="index+1"  :index="''+index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="subitem.path" v-for="(subitem,index) in item.children" :key="index+1">
              <i class="el-icon-menu"></i>{{subitem.authName}}
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="my-main">
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { menus } from './http/http'
export default {
  methods: {
    out() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          window.localStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  },
  data() {
      return {
          menuslist:[]
      }
  },
  created() {
      menus().then(res => {
          //console.log(res);
          this.menuslist = res.data.data
      })
  },
  name:'index'
};
</script>

<style lang="less" scoped>
.my-container {
  height: 100%;
  .my-header {
    background-color: rgb(179, 192, 209);
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      font-size: 24px;
      color: white;
    }
    a {
      font-size: 16px;
      color: orange;
    }
  }

  .my-main {
    background-color: rgb(233, 238, 243);
    padding: 0 20px;
  }
}
</style>