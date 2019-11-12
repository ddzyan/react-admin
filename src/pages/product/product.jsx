import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import ProductAddUpdate from "./add-update";
import ProductDetail from "./detail";
import ProductHome from "./home";
import "./product.less";
class Product extends Component {
  state = {};

  /**
   * Switch 默认为模糊匹配，路径输入 /product/add ，则优先匹配/product
   * 需要添加精准匹配属性
   */
  render() {
    return (
      <Switch>
        <Route path="/product" component={ProductHome} exact={true} />
        <Route path="/product/add" component={ProductAddUpdate} />
        <Route path="/product/update" component={ProductAddUpdate} />
        <Route path="/product/detail" component={ProductDetail} />
        <Redirect to="/product" />
      </Switch>
    );
  }
}

export default Product;
