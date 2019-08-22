<template>
  <div>
    <!--面包屑导航-->
    <bread first="用户管理" second="用户列表"></bread>
    <!--layout布局-->
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-input
            placeholder="请输入内容"
            v-model="searchcontent"
            class="input-with-select"
            @input="searchcontents"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchcontents"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <el-button type="success" plain @click="adduser">添加用户</el-button>
        </div>
      </el-col>
    </el-row>
    <!--table表格单选模板-->
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="username" label="姓名" width="200"></el-table-column>
      <el-table-column property="email" label="邮箱" width="250"></el-table-column>
      <el-table-column property="mobile" label="电话" width="250"></el-table-column>
    <!--用户状态栏table表格自定义模板-->
      <el-table-column label="用户状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="editstaus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    <!--操作栏table表格自定义模板-->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="useredit(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="userdelete(scope.row)"
          ></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini" @click="userrole(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器模板-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--添加用户对话框模板-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model.trim="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model.trim="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model.trim="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改用户对话框模板-->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisibles">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input :disabled="true" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibles = false">取 消</el-button>
        <el-button type="primary" @click="editsubmit('ruleForm',id)">确 定</el-button>
      </div>
    </el-dialog>

    <!--角色分配对话框模板-->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibless">
      <el-form :model="userform">
        <el-form-item label="当前用户" :label-width="formLabelWidth" prop="username">
          <span>{{userform.username}}</span>
        </el-form-item>
        <el-form-item label="请选择角色" :label-width="formLabelWidth">
          <el-select v-model="userform.rid" placeholder="">
            <el-option label="请选择角色" value="" :disabled="true"></el-option>
            <el-option :label="item.roleName" :value="item.id" v-for="(item,index) in rolelist" :key="index+1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibless = false">取 消</el-button>
        <el-button type="primary" @click="rolesubmit('userform')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
//axios   http变量名导入
import {
  userlist,
  adduser,
  userstatus,
  userqurey,
  useredit,
  userdelete,
  roleallot,
  roleslist
} from "../http/http";

export default {
  data() {
    return {
      //角色分配的数据表单
      userform:{
        rid:0,
        username:''
      },
      //角色列表
      rolelist:[],
      //点击操作栏把点击的目标id保存
      id: "",
      //表单验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符",
            trigger: "change"
          }
        ]
      },
      //输入框的宽度
      formLabelWidth: "120px",
      //添加用户，修改用户资料表单的数据
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户弹框
      dialogFormVisible: false,
      //修改用户弹框
      dialogFormVisibles: false,
      //角色分配弹框
      dialogFormVisibless:false,
      switchs: false,
      searchcontent: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      currentRow: null,
      pagenum: 1,
      pagesize: 5,
      total: 0
    };
  },
  methods: {
    //角色分配提交函数
    rolesubmit(){
      roleallot(this.id,{ rid:this.userform.rid })
      .then(res => {
        
        if(res.data.meta.status == 200){
          this.$message.success(res.data.meta.msg)

          this.userform.rid = res.data.data.rid
          //console.log(res.data.data);
          this.getUserList();
          this.dialogFormVisibless = false
        }else{
          this.$message.error(res.data.meta.msg)
        }
      })
      
    },
    //角色分配触发函数
    userrole(user){
      this.dialogFormVisibless = true
      this.id = user.id
      this.userform.username = user.username
      let rid;

      for(let i = 0; i < this.rolelist.length; i++){
        if(user.role_name == this.rolelist[i].roleName){
          rid = this.rolelist[i].id
          break
        }
      }
      this.userform.rid = rid

    },
    //用户点击删除触发函数
    userdelete(user) {
      this.$confirm("确认删除此用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          userdelete(user.id).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getUserList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //用户资料点击提交触发函数
    editsubmit(formName,id ) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          useredit(id, {
            email: this.ruleForm.email,
            mobile: this.ruleForm.mobile
          }).then(res => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.$message.success("修改成功");
              this.getUserList();
              this.dialogFormVisibles = false;
            } else {
              this.$message.error("修改失败");
            }
          });
          //this.dialogFormVisibles = false
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //用户资料修改触发函数
    useredit(user) {
      this.ruleForm = {
        username: "",
        password: "",
        email: "",
        mobile: ""
      };
      this.id = user.id
      this.dialogFormVisibles = true;
      this.ruleForm.username = user.username
      this.ruleForm.email = user.email
      this.ruleForm.mobile = user.mobile
      
    },
    //用户状态点击触发函数
    editstaus(userinfo) {
      userstatus(userinfo.id, userinfo.mg_state).then(res => {
        //console.log(res);
      });
    },
    //搜索框输入触发函数
    searchcontents() {
      this.getUserList();
    },
    //增加用户提交触发函数
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(formName);

          adduser(this.ruleForm).then(res => {
            console.log(res);
            if (res.data.meta.status == 201) {
              this.$message.success(res.data.meta.msg);
              this.dialogFormVisible = false;
              this.getUserList();
            } else {
              this.$message.error(res.data.meta.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //分页器页当前页改变触发
    handleCurrentChange(page) {
      this.pagenum = page;
      this.getUserList();
    },
    //分页器页容量改变触发
    handleSizeChange(page) {
      this.pagesize = page;
      this.pagenum = 1;
      this.getUserList();
    },
    //封装   发送userlist请求
    getUserList() {
      userlist({
        query: this.searchcontent,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        //console.log(res);
        this.tableData = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    //点击添加用户触发函数
    adduser() {
      this.ruleForm = {
        username: "",
        password: "",
        email: "",
        mobile: ""
      };
      //激活messagebox弹框
      this.dialogFormVisible = true;
    }
  },
  //数据，方法初始化完成发送请求加载userlist
  created() {
    this.getUserList();

    roleslist().then(res => {
      
      this.rolelist = res.data.data
      //console.log(res.data.data);
    })
  },
  name: "userlist"
};
</script>

<style lang="less" scoped>

</style>