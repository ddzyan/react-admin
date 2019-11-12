/**
 * 包含n个action creator 函数的模块
 * async action：对象{type:'xxx',data:xxx}
 * sync action：函数 dispatch=>{}
 */
import { login } from "../api";
import { SET_HEAD_TITLE, RECIVER_USER, SHOW_MSG ,RESET_USER} from "./action-types";
import storageUtils from "../utils/storageUtils";

/**
 * sync action 用于设置标题名称
 */
export const setHeadTitle = headTitle => ({ type: SET_HEAD_TITLE, headTitle });

/**
 * 保存用户对象
 */
export const reciverUser = user => ({ type: RECIVER_USER, user });

/**
 * 保存登陆错误信息
 */
export const showMsg = errorMessage => ({ type: SHOW_MSG, errorMessage });


/**
 * 退出登陆
 * 重置本地locationstroage
 * 重置 state
 */
 export const resetUser = ()=>{
  storageUtils.removeUser()
  return {type:RESET_USER}
 }

/**
 * async action
 * 异步发送登陆请求
 * 成功则调用 reciver_user 报存 user 对象，并且保存到 locationstorage 中
 * 失败则调用 show_error,将错误信息报错user对象的 errorMessage 属性中
 */
export const userLogin = (username, password) => {
  return async dispatch => {
    //1 登陆
    const response = await login(username, password);
    if (response && response.status === 0) {
      const user = response.data;
      //2 成功则调用 action 保存 user 对象到 redux管理的 state.user 中，并且保存到 locationstorage中
      storageUtils.saveUser(user);
      dispatch(reciverUser(user));
    } else {
      //2 失败则调用 action 保存 message 到 redux 管理的 state.user.errorMessage
      dispatch(showMsg(response.msg));
    }
  };
};
