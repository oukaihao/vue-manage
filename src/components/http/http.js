//导入axios包
import axios from 'axios'
//实例axios对象
const http = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/'
})

//请求拦截
http.interceptors.request.use(function (config) {

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

//角色分配请求
export const roleallot = (uId,{ rid }) => {
    return http.put(`users/${uId}/role`,{ rid })
}