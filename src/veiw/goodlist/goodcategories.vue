<template>
  <div>
    <!--layout布局-->
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入内容" v-model="searchcontent" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <el-button type="success" plain @click="$router.push('/goods/add')">添加用户</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table border ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column property="goods_price" label="商品价格（元）" width="120"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量" width="100"></el-table-column>
      <el-table-column property="add_time" label="创建时间" width="180">
        <template slot-scope="scope">
          {{scope.row.add_time | formaTime('YYYY年MM月DD hh:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column property="address" label="操作">
        <template>
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
    class="my-pagination"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenum"
      :page-size="pagesize"
      layout="prev, pager, next, jumper"
      :total="totals">
    </el-pagination>
  </div>
</template>

<script>
import { shopList } from '../../http/http'
import moment from 'moment'
export default {
  data() {
    return {
      pagenum:1,
      pagesize:10,
      totals:0,
      searchcontent: "",
      tableData: []
    };
  },
  methods: {
    handleCurrentChange(val){
      this.pagenum = +val
      this.getShopLists()
    },
    getShopLists(){
      shopList({pagenum:this.pagenum,pagesize:this.pagesize}).then(res => {
      
      this.tableData = res.data.data.goods
      this.totals = +res.data.data.total
      console.log(res);
    })
    }
  },
  created() {
    this.getShopLists()
  },

};
</script>

<style lang="less" scoped>
  .my-pagination{
    margin-bottom: 30px;
  }
</style>