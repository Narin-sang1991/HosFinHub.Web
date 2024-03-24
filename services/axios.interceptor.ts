import axios, { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { message } from 'antd';
// import Cookies from 'universal-cookie';

// import { C_TOKEN, APP_ID_VALUE, APP_ID_NAME, } from 'constants/localStorage';
// const cookies = new Cookies();
// let isAlreadyFetchingAccessToken = false
// let subscribers = []

// function onAccessTokenFetched(access_token) {
//     subscribers = subscribers.filter(callback => callback(access_token))
// }

// function addSubscriber(callback) {
//     subscribers.push(callback)
// }
const baseDomain: string = 'https://app-gulf-centralized-staging-api.azurewebsites.net'
const config: AxiosRequestConfig = {
    baseURL: baseDomain,
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
const axiosProvider = axios.create(config);

axiosProvider.interceptors.response.use(
    function (response) {
        return response.data;
    }, function (error) {
        if (error.response.status === 500)
            message.error(`${error.response.status} : ${error.response.statusText}`)
        else
            message.warning(error.response.data ? error.response.data.error : error.response.statusText)

        return Promise.reject(error)
    })


const dataURItoBlob = (dataURI: string) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}

export { axiosProvider, dataURItoBlob };