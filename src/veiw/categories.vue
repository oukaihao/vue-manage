<template>
  <div>
    <bread first="商品管理" second="商品分类"></bread>
    <el-button type="success" plain @click="addcate">添加分类</el-button>
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
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="editCate(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="delShopCate(scope.row)"
          ></el-button>
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

    <!--添加分类对话框-->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormVisible">
      <el-form :model="cateform">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="cateform.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-cascader
            placeholder="默认添加一级分类"
            v-model="cateform.value"
            :options="options"
            :props="{ expandTrigger: 'hover', label:'cat_name',value:'cat_id', checkStrictly:true }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcatesubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑分类对话框-->
    <el-dialog title="编辑商品分类" :visible.sync="dialogFormVisibles">
      <el-form :model="editfrom">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="editfrom.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibles = false">取 消</el-button>
        <el-button type="primary" @click="editCateSubimt">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  shoplist,
  addcategories,
  editShopCate,
  delShopCate
} from "../http/http";
export default {
  data() {
    return {
      row: {},
      editfrom: {
        cat_name: ""
      },
      dialogFormVisibles: false,
      formLabelWidth: "120px",
      options: [],
      cateform: {
        cat_name: "",
        value: []
      },
      dialogFormVisible: false,
      tableData: [],
      total: [],
      pageindex: 1,
      pageSize: 5
    };
  },
  methods: {
    delShopCate(row) {
      this.$confirm("是否删除此商品分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delShopCate(row.cat_id).then(res => {
            //console.log(res);    
            this.getShopDate();     
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editCate(row) {
      this.dialogFormVisibles = true;
      this.row = row;
      //console.log(row);
      this.editfrom.cat_name = row.cat_name;
    },
    editCateSubimt() {
      editShopCate({
        id: this.row.cat_id,
        cat_name: this.editfrom.cat_name
      }).then(res => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success("修改成功");
          this.row.cat_name = res.data.data.cat_name;
          this.dialogFormVisibles = false;
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    addcatesubmit() {
      let length = this.cateform.value.length;
      //分类层级
      this.cateform.cat_level = length;
      //console.log(cat_level);

      //分类父id
      if (length == 0) {
        this.cateform.cat_pid = 0;
      } else {
        this.cateform.cat_pid = this.cateform.value[length - 1];
      }
      console.log(this.cateform);
      addcategories(this.cateform).then(res => {
        console.log(res);
        if (res.data.meta.status == 201) {
          this.$message.success("添加成功");
          this.cateform.cat_name = "";
          this.cateform.value = [];
          this.getShopDate();
          this.dialogFormVisible = false;
        } else {
          this.$message.error("添加失败");
        }
      });
    },
    addcate() {
      this.dialogFormVisible = true;
    },
    handleCurrentChange(val) {
      this.pageindex = val;
      let startIndex = (this.pageindex - 1) * this.pageSize;
      let endIndex = this.pageindex * this.pageSize;
      this.tableData = this.total.slice(startIndex, endIndex);
    },
    //获取商品分类
    getShopDate() {
      shoplist(3).then(res => {
        //console.log(res);
        this.total = res.data.data;
        let startIndex = (this.pageindex - 1) * this.pageSize;
        let endIndex = this.pageindex * this.pageSize;
        this.tableData = this.total.slice(startIndex, endIndex);
      });
      shoplist(2).then(res => {
        this.options = res.data.data;
        //console.log(res);
      });
    }
  },
  created() {
    this.getShopDate();
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

<style lang="less" scoped>
</style>>
