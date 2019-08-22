<template>
  <div>
    <bread first="角色管理" second="权限管理"></bread>
    <el-button plain @click="addrole">添加角色</el-button>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <p v-if="scope.row.children.length == 0">没有分配到权限哦</p>
          <el-row v-for="(level1,index) in scope.row.children" :key="index">
            <el-col :span="4">
              <el-tag closable :type="''" @close="delright(scope.row,level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(level2,index) in level1.children" :key="index">
                <el-col :span="6">
                  <el-tag
                    closable
                    type="success"
                    @close="delright(scope.row,level2.id)"
                  >{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    @close="delright(scope.row,level3.id)"
                    class="my-tag"
                    v-for="(level3,index) in level2.children"
                    :key="index"
                    closable
                    type="warning"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <!-- slot-scope="scope" -->
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="editroles(scope.row)"
          ></el-button>

          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="delroles(scope.row)"
          ></el-button>

          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="rightallot(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--权限提交对话框-->
    <el-dialog title="提示" :visible.sync="dialogVisible">
      <el-tree
        :data="data"
        show-checkbox
        ref="tree"
        node-key="id"
        default-expand-all
        :default-checked-keys="[5]"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rightsubimt()">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑角色资料对话框-->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="desc">
          <el-input v-model="ruleForm.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleseditsubimt">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibles">
      <el-form :model="addroleForm" :rules="rules" ref="addroleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addroleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="desc">
          <el-input v-model="addroleForm.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibles = false">取 消</el-button>
        <el-button type="primary" @click="addrolesubimt">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  roles,
  delroleright,
  rights,
  roleright,
  rolesedit,
  delroles,
  addrolrs
} from "../http/http";
export default {
  data() {
    return {
      
      addroleForm:{
        name:'',
        desc:''
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入角色描述", trigger: "blur" }]
      },
      dialogFormVisibles:false,
      dialogFormVisible: false,
      ruleForm: {
        name: "",
        desc: ""
      },
      formLabelWidth: "120px",
      roleID: "",
      row: {},
      data: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      dialogVisible: false,
      tableData: []
    };
  },
  methods: {
    addrolesubimt(){
      addrolrs( {
        roleName:this.addroleForm.name,
        roleDesc:this.addroleForm.desc
      } )
      .then(res => {
        console.log(res);
        if(res.data.meta.status == 201){
          this.$message.success('添加成功')
          this.getRoleList()
          this.dialogFormVisibles = false
        }else{
          this.$message.error(res.data.meta.msg)
        }
      })
      
    },
    addrole(){
      this.dialogFormVisibles = true
    },
    delroles(row) {
      this.$confirm("确定删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delroles(row.id).then(res => {
            //console.log(res);
            this.getRoleList()
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
    roleseditsubimt() {
      rolesedit(this.roleID, {
        roleName: this.ruleForm.name,
        roleDesc: this.ruleForm.desc
      }).then(res => {
        console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success("修改成功");
          this.row.roleName = res.data.data.roleName;
          this.row.roleDesc = res.data.data.roleDesc;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
      this.dialogFormVisible = false;
    },
    editroles(row) {
      this.dialogFormVisible = true;
      this.roleID = row.id;
      this.row = row;
      this.ruleForm.name = row.roleName;
      this.ruleForm.desc = row.roleDesc;
    },
    rightsubimt() {
      let checked = this.$refs.tree.getCheckedKeys();
      let hackchecked = this.$refs.tree.getHalfCheckedKeys();
      let arr = [...checked, ...hackchecked];
      let str = arr.join(",");
      //console.log(str);

      roleright(this.roleID, { rids: str }).then(res => {
        //console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success("角色授权成功");

          this.getRoleList()
        } else {
          this.$message.error("角色授权失败");
        }
      });
      this.dialogVisible = false;
    },
    rightallot(row) {
      this.dialogVisible = true;
      this.roleID = row.id;
      let list = [];
      function getID(item) {
        if (item.children) {
          for (var i = 0; i < item.children.length; i++) {
            getID(item.children[i]);
          }
        } else {
          list.push(item.id);
        }
      }
      getID(row);

      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(list);
        //console.log(this.$refs.tree);
      });
    },
    delright(row, right) {
      delroleright(row.id, right).then(res => {
        //console.log(res);
        if (res.data.meta.status == 200) {
          this.$message.success("删除权限成功");
          row.children = res.data.data;
        } else {
          this.$message.success("删除权限失败");
        }
      });
    },
    getRoleList(){
      roles().then(res => {
      this.tableData = res.data.data;
    });
    }
  },
  created() {
    // roles().then(res => {
    //   this.tableData = res.data.data;
    // });
    this.getRoleList()
    rights("tree").then(res => {
      //console.log(res);
      this.data = res.data.data;
    });
  },
  name: "rolelist"
};
</script>

<style lang="less" scoped>
.my-tag {
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>