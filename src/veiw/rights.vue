<template>
  <div>
    <bread first="权限管理" second="权限列表"></bread>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope">
          <span>{{scope.row.level | formatLevel}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { rights } from "../http/http";
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    rights("list").then(res => {
      //console.log(res);
      if (res.data.meta.status == 200) {
        this.tableData = res.data.data;
      }
    });
  },
  filters: {
    formatLevel(val) {
      switch (val) {
        case '0':
          return "一级";
          break;
        case '1':
          return "二级";
          break;
        case '2':
          return "三级";
          break;
      }
    }
  }
};
</script>

<style>
</style>