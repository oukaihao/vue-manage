//导入axios包
import axios from 'axios'
//实例axios对象
const http = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/'
})

//login请求
export const login = ({username, password}) => {
    return http.post('/login', {
        username,
        password
    }
    )
}

//左侧菜单请求
export const menus = () => {
    return http.get('/menus',{
        headers:{
            Authorization: window.localStorage.getItem('token')
        }
    })
}