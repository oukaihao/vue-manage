<template>
  <div>
    <bread first="订单管理" second="订单列表"></bread>
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="order_number" label="订单编号" width="300"></el-table-column>
      <el-table-column property="order_price" label="订单价格" width="80"></el-table-column>
      <el-table-column property="pay_status" label="是否付款" width="120">
        <template slot-scope="scope">
          <el-tag type="danger" class="my-tag">{{scope.row.pay_status?'未付款':'已付款'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="is_send" label="是否发货"></el-table-column>
      <el-table-column property="create_time" label="下单时间">
        <template slot-scope="scope">{{ scope.row.create_time | formaTime('YYYY-MM-DD hh:mm:ss')}}</template>
      </el-table-column>
      <el-table-column property="address" label="操作">
        <!-- slot-scope="scope"-->
        <template>
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="editAddress"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="pagenum"
      :page-size="pagesize"
      layout="prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="addressform">
        <el-form-item label="活动名称">
          <el-input v-model="addressform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动名称">
          <VDistpicker :province="select.province" :city="select.city" :area="select.area"></VDistpicker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ordersHttp } from "../http/http";
import VDistpicker from "v-distpicker";
export default {
  components: {
    VDistpicker
  },
  data() {
    return {
      select: { province: "广东省", city: "广州市", area: "海珠区" },
      addressform: {},
      dialogFormVisible: false,
      tableData: [],
      pagenum: 1,
      pagesize: 8,
      total: 0
    };
  },
  methods: {
    editAddress() {
      this.dialogFormVisible = true;
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getOrder();
    },
    getOrder() {
      ordersHttp({
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        console.log(res);
        this.tableData = res.data.data.goods;
        this.total = res.data.data.total;
      });
    }
  },
  created() {
    this.getOrder();
  },
  name: "orders"
};
</script>

<style lang="less" scoped>
.my-tag {
  margin-left: 20px;
}
</style>