import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ProductAddUpdate from "./add-update";
import ProductDetail from "./detail";
import AccountHome from "./home";
import "./account.less";
class Account extends Component {
  state = {};

  /**
   * Switch 默认为模糊匹配，路径输入 /product/add ，则优先匹配/product
   * 需要添加精准匹配属性
   */
  render() {
    return (
      <Switch>
        <Route path="/account" component={AccountHome} exact={true} />
        <Route path="/account/add" component={ProductAddUpdate} />
        <Route path="/account/update" component={ProductAddUpdate} />
        <Route path="/account/detail" component={ProductDetail} />
        <Redirect to="/account" />
      </Switch>
    );
  }
}

export default Account;
