/*
 * @Author: dingdongzhao
 * @Date: 2019-09-15 23:50:37
 * @Last Modified by: dingdongzhao
 * @Last Modified time: 2019-11-21 15:26:53
 */
import axios from "axios";
import { message } from "antd";

/**
 * 使用单例模式封装 axios,在创建 axios 实例的时候，避免重复传入一样的参数
 * 参数接收 url ,data , method
 * 根据 method 决定发送的类型
 */

let instance = null;
let auth = null;
/**
 * 使用新的 Promise 包装 axios的目的为
 * 1. 优化返回值，返回response.data
 * 2. 统一错误信息处理,采用 message.error 显示
 * 3. 不适用 async await 改造为同步流程的目的，是将i/o事件丢给事件循环处理，主线程可以处理其他事件，加快反应速度
 */

export default function(url, data = {}, method = "GET") {
  return new Promise((resolve, reject) => {
    let promise = null;
    if (!instance) {
      instance = axios.create({
        //baseURL: 'http://127.0.0.1:5000',
        timeout: 1000,
        auth
      });
    }
    if (method === "GET") {
      promise = instance.get(url, {
        params: data
      });
    } else {
      promise = instance.post(url, data);
    }

    promise
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        message.error(err.message);
      });
  });
}
