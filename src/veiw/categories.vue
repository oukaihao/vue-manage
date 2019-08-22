<template>
  <div>
    <bread first="商品管理" second="商品分类"></bread>
    <el-button type="success" plain>添加分类</el-button>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="cat_id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="cat_name" label="分类名称" sortable width="350"></el-table-column>
      <el-table-column prop="cat_level" label="级别" sortable width="180">
        <template slot-scope="scope">{{ scope.row.cat_level | formatlevel}}</template>
      </el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效" sortable width="180">
        <template slot-scope="scope">{{ scope.row.cat_deleted?'无效':'有效'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="pageindex"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total.length"
    ></el-pagination>
  </div>
</template>

<script>
import { shoplist } from "../http/http";
export default {
  data() {
    return {
      tableData: [],
      total: [],
      pageindex: 1,
      pageSize: 5
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.pageindex = val;
      let startIndex = (this.pageindex - 1) * this.pageSize;
      let endIndex = this.pageindex * this.pageSize;
      this.tableData = this.total.slice(startIndex, endIndex);
    }
  },
  created() {
    shoplist(3).then(res => {
      //console.log(res);
      this.total = res.data.data;
      let startIndex = (this.pageindex - 1) * this.pageSize;
      let endIndex = this.pageindex * this.pageSize;
      this.tableData = this.total.slice(startIndex, endIndex);
    });
  },
  filters: {
    formatlevel(val) {
      switch (val) {
        case 0:
          return "一级";
        case 1:
          return "二级";
        case 2:
          return "三级";
      }
    }
  },
  name: "categories"
};
</script>

<style>
</style>