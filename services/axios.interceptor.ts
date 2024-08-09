import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { message } from 'antd';



const hosBaseDomain: string = 'http://192.168.101.243:5201/'
//const hosBaseDomain: string = 'http://183.88.219.85:5200/'
const configHosBase: AxiosRequestConfig = {
    baseURL: hosBaseDomain,
    // mode: 'cors',
    // crossDomain: true,
    // credentials: "same-origin",
    withCredentials: false,
    timeout: 3000000,
    headers: {
        'Accept': '*/*',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json;charset=utf-8',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    } as RawAxiosRequestHeaders,
};
const axiosHosProvider = axios.create(configHosBase);

axiosHosProvider.interceptors.response.use(
    function (response) {
        return response.data;
    }, function (error) {
        if (error.response.status === 500)
            message.error(`${error.response.status} : ${error.response.statusText}`)
        else
            message.warning(error.response.data ? error.response.data.error : error.response.statusText)

        return Promise.reject(error)
    })


export { axiosHosProvider };