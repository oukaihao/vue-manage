<template>
  <div>
    <bread first="商品管理" second="分类参数"></bread>
    <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon class="my-alert"></el-alert>
    <div class="my-select">
      <span>请选择商品分类：</span>
      <el-cascader
        v-model="value"
        :options="options"
        :show-all-levels="false"
        :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }"
        @change="paramslist"
      ></el-cascader>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="动态参数" name="first">
        <el-button type="primary" size="small" :disabled="value.length == 0?true:false">添加动态参数</el-button>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <!-- slot-scope="props"-->
            <template slot-scope="props">
                <el-tag
                  :key="tag.name"
                  v-for="tag in props.row.attr_vals.split(',')"
                  closable
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model.trim="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm(props.row.attr_vals.split(','),props.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="商品参数" prop="attr_name"></el-table-column>
          <el-table-column label="操作" prop="name">
            <template>
              <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { shoplist, paramsList,paramsPorp } from "../../http/http";
export default {
  name:'params',
  data() {
    return {
      inputVisible: false,
      inputValue: "",
      value: [],
      tableData: [],
      options: [],
      activeName: "first"
    };
  },
  methods: {
    paramslist() {
      paramsList(this.value[this.value.length-1], { sel: "many" }).then(res => {
        this.tableData = res.data.data;
        console.log(res);
        
      });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(arrparams,row) {
      
      
      let inputValue = this.inputValue;
      if (this.inputValue) {
         arrparams.push(this.inputValue) 
      }
      this.inputVisible = false;
      this.inputValue = "";
      console.log(arrparams);
      paramsPorp(row.attr_id,{
        attr_name:row.attr_name,
        attr_sel:'many',
        attr_vals:arrparams.join()
      }).then(res => {
        console.log(res);
        if(res.data.meta.status == 201){
          row = res.data.data
          this.$message.success('添加成功')
          
        }
      })
    },
  },
  created() {
    shoplist(3).then(res => {
      this.options = res.data.data;
      //console.log(this.options);
    });
  }
};
</script>

<style lang="less" scoped>
.my-alert {
  margin: 20px auto;
  font-size: 13px;
  line-height: 18px;
}
.my-select {
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>