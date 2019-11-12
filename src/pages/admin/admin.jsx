import React, { Component } from "react";
import { Layout } from "antd";
import { connect } from "react-redux";
import { Redirect, Switch, Route } from "react-router-dom";

import "./admin.less";

import Home from "../home/home";
import Category from "../category/category";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";
import Order from "../order/order";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import NotFound from "../not-fount/not-found";
import LeftNav from "../../components/left-nav";
import Header from "../../components/header";

const { Footer, Sider, Content } = Layout;
class Admin extends Component {
  state = {};

  render() {
    const { user } = this.props;
    if (!user.id) {
      return <Redirect to="/login"></Redirect>;
    }

    return (
      <Layout className="admin">
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content style={{ backgroundColor: "#fff", margin: 20 }}>
            <Switch>
              <Redirect from="/" exact to="/home" />
              <Route path="/home" component={Home} />
              <Route path="/category" component={Category} />
              <Route path="/product" component={Product} />
              <Route path="/user" component={User} />
              <Route path="/role" component={Role} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/pie" component={Pie} />
              <Route path="/charts/line" component={Line} />
              <Route path="/order" component={Order} />
              <Route component={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center", color: "#cccc" }}>
            推荐使用谷歌浏览器,获得更好的使用体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default connect(state => ({ user: state.user }))(Admin);
