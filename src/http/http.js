//导入axios包
import axios from 'axios'

//import router from '../router/router'

import Vue from 'vue'
//实例axios对象
const http = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/'
})

//请求拦截
http.interceptors.request.use(function (config) {
    //falg = null
    // 发送请求前调用（发送请求做一些事）
    // 把你所有的请求拦下来
    // 拦下来给你加一个请求头，请求头的内容是token
    config.headers.Authorization = window.localStorage.getItem('token')
    // window.console.log('我调用了', config)
    return config;

}, function (error) {

    //发生错误的回调函数
    return Promise.reject(error);
});

//let falg = false;

//响应拦截
//http.interceptors.response.use(function (response) {

    //if(falg){
   //     return
   // }
    // 对响应数据做点什么
   // console.log(response);
    //if(response.data.meta.status == 400 && response.data.meta.msg == '无效token'){
     //   router.push('/login')
       // Vue.prototype.$message.error('请先登录！')
       // falg = true
   // }
   // return response;
  //}, function (error) {
    // 对响应错误做点什么
    //return Promise.reject(error);
  //});

//login请求
export const login = ({ username, password }) => {
    return http.post('login', {
        username,
        password
    }
    )
}

//左侧菜单请求
export const menus = () => {
    return http.get('menus', {
        // headers:{
        //     Authorization: window.localStorage.getItem('token')
        // }
    })
}



//用户列表请求
export const userlist = ({ query, pagenum, pagesize }) => {
    return http.get('users',
        {
            params: {
                query,
                pagenum,
                pagesize
            }
        }
    )
}

//添加用户请求
export const adduser = ({ username, password, email, mobile }) => {
    return http.post('users', 
         {
            username,
            password,
            email,
            mobile
        }
    
    )
}

//修改用户状态请求

export const userstatus = ( uId,type ) => {
    return http.put(`users/${uId}/state/${type}`)
}

//查询用户资料请求
export const userqurey = (uId) => {
    return http.get(`users/${uId}`)
}

//修改用户资料请求
export const useredit = (uId,{ email,mobile }) => {
    return http.put(`users/${uId}`,{ email,mobile })
}

//删除个人用户请求
export const userdelete = (uId) => {
    return http.delete(`users/${uId}`)
}

//角色列表请求
export const roleslist = () => {
    return http.get('roles')
}

//角色分配请求
export const roleallot = (uId,{ rid }) => {
    return http.put(`users/${uId}/role`,{ rid })
}

//所有权限列表请求
export const rights = (type) => {
    return http.get(`rights/${type}`)
}

//角色列表请求
export const roles = () => {
    return http.get('roles')
}

//删除角色指定权限请求
export const delroleright = (roleId,rightId) => {
    return http.delete(`roles/${roleId}/rights/${rightId}`)
}

//角色授权请求
export const roleright = (rid,{ rids }) => {
    return http.post(`roles/${rid}/rights`,{
        rids
    })
}

//角色资料编辑请求
export const rolesedit = (roleID,{ roleName,roleDesc }) => {
    return http.put(`roles/${roleID}`,{
        roleName,
        roleDesc
    })
}

//删除角色请求
export const delroles = (id) => {
    return http.delete(`roles/${id}`)
}

//添加角色请求
export const addrolrs = ( { roleName,roleDesc } ) => {
    return http.post('roles',{
        roleName,
        roleDesc
    })
}

//商品分类列表请求
export const shoplist = (type) => {
    return http.get('categories',{ type })
}