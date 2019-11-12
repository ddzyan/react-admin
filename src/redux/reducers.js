/**
 * 根据老的state和传入的action,生成新的state
 */
import { combineReducers } from "redux";

import {
  SET_HEAD_TITLE,
  RECIVER_USER,
  SHOW_MSG,
  RESET_USER
} from "./action-types";
import storageUtils from "../utils/storageUtils";

const initHeadTitle = "";
const headTitle = (state = initHeadTitle, action) => {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.headTitle;
    default:
      return state;
  }
};
const initUser = storageUtils.getUser();
const user = (state = initUser, action) => {
  switch (action.type) {
    case RECIVER_USER:
      return action.user;
    case SHOW_MSG:
      const errorMessage = action.errorMessage;
      return { ...state, errorMessage };
    case RESET_USER:
      return {};
    default:
      return state;
  }
};

/**
 * 向外默认的暴露的是合并产生的总的reduce函数
 * 管理的 总和state的结构是
 * {
 *  headerTitle:'首页'，
 * user:{}
 * }
 */
export default combineReducers({
  headTitle,
  user
});
