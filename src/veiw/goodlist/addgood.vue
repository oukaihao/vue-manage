<template>
  <div>
    <el-alert title="添加商品信息" type="info" show-icon center class="my-alert"></el-alert>
    <el-steps :active="+active" finish-status="success" id="my-steps">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-tabs tab-position="left" v-model="active">
      <el-tab-pane label="基本信息" name="0">
        <el-form
          label-position="top"
          label-width="80px"
          :model="formLabelAlign"
          :rules="rules"
          ref="formLabelAlign"
        >
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formLabelAlign.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="price">
            <el-input v-model="formLabelAlign.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="weight">
            <el-input v-model="formLabelAlign.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="number">
            <el-input v-model="formLabelAlign.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="cate">
            <el-cascader
              v-model="formLabelAlign.value"
              :options="options"
              :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id' }"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">配置管理</el-tab-pane>
      <el-tab-pane label="商品属性" name="2">
        <el-form
          label-position="top"
          label-width="80px"
          :model="formporp"
          :rules="rules"
          ref="formLabelAlign"
        >
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formporp.name"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="header"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        <el-button type="primary">添加商品</el-button>
        <quillEditor class="editor"></quillEditor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { shoplist } from "../../http/http";
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      header: {
        Authorization: window.localStorage.getItem("token")
      },
      fileList: [],
      formporp: {},
      options: [],
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        cate: [{ required: true, message: "请输入商品分类", trigger: "blur" }]
      },
      formLabelAlign: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        value: []
      },
      active: 0
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    handlePreview(file) {
      console.log(file);
    }
  },
  created() {
    shoplist(3).then(res => {
      console.log(res);
      this.options = res.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
.my-alert {
  margin: 20px auto;
  font-size: 20px;
}
#my-steps {
  margin: 0 100px;
  font-size: 12px;
  margin-bottom: 20px;
}
.editor {
  height: 100%;
}
</style>