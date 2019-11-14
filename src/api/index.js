import jsonp from "jsonp";
import { message } from "antd";

import ajax from "./ajax";

// 登陆
export const login = async (username, password) =>
  ajax("/login", { username, password }, "POST");

// 添加类别
export const addCategory = (
  chainName,
  currencyName,
  explorer,
  contract,
  balanceType,
  state,
  decimal,
  parentId
) =>
  ajax(
    "/manage/category/add",
    {
      chainName,
      currencyName,
      explorer,
      contract,
      balanceType,
      state,
      decimal,
      parentId
    },
    "POST"
  );
// 更新类别
export const updateCategory = (
  chainName,
  currencyName,
  explorer,
  contract,
  balanceType,
  state,
  decimal,
  categoryId
) =>
  ajax(
    "/manage/category/update",
    {
      chainName,
      currencyName,
      explorer,
      contract,
      balanceType,
      state,
      decimal,
      categoryId
    },
    "POST"
  );

// 获取一级或某个二级分类列表
export const getCategory = parentId =>
  ajax("/manage/category/list", { parentId }, "GET");

// 根据分类ID 获取分类名称
export const getCategoryInfo = async categoryId =>
  ajax("/manage/category/info", { categoryId }, "GET");

//对商品进行上架/下架处理
export const updateProductStatus = async (productId, status) =>
  ajax("/manage/account/updateStatus", { productId, status }, "POST");

/**
 * 获取商品分页列表
 * @param {string} pageNum 当前页码
 * @param {string} pageSize  一页显示数量
 */
export const getProductList = (pageNum, pageSize) =>
  ajax("/manage/account/list", { pageNum, pageSize }, "GET");

// 优化个查询条件接口
export const searchProductList = (pageNum, pageSize, searchName, searchType) =>
  ajax(
    "/manage/account/search",
    { pageNum, pageSize, [searchType]: searchName },
    "GET"
  );

//删除商品
export const delProduct = _id =>
  ajax("/manage/account/delete", { _id }, "POST");

// 删除图片
export const deleteImg = name => ajax("/manage/img/delete", { name }, "POST");

// 更新/添加商品
export const AddOrUpdateProduct = ({
  id,
  categoryId,
  account,
  address,
  publicKey,
  balance,
  state
}) =>
  ajax(
    `/manage/account/${id ? "update" : "add"}`,
    {
      id,
      categoryId,
      account,
      address,
      publicKey,
      balance,
      state
    },
    "POST"
  );

// 获取角色列表
export const getRoleList = () => ajax("/manage/role/list", {}, "GET");

// 添加角色
export const addRole = name => ajax("/manage/role/add", { name }, "POST");

// 更新角色权限
export const updateRole = ({ id, menus, auth_time, auth_name }) =>
  ajax("/manage/role/update", { id, menus, auth_time, auth_name }, "POST");

// 获取用户列表
export const getUserList = () => ajax("/manage/user/list", {}, "GET");

// 添加/修改用户
export const addOrUpdateUser = user =>
  ajax(`/manage/user/${user.id ? "update" : "add"}`, { ...user }, "POST");

// 删除用户
export const deleteUser = userId =>
  ajax("/manage/user/delete", { userId }, "POST");

//使用 jsonp 发送获取天气连接，jsonp 可以解决浏览器端 GET 请求跨域问题
export const getWeather = city => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    jsonp(url, {}, (err, data) => {
      if (!err && data.error === 0) {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0];
        resolve({ dayPictureUrl, weather });
      } else {
        message.error("获取天气信息失败");
      }
    });
  });
};
