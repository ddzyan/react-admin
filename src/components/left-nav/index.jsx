import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "./index.less";
import { setHeadTitle } from "../../redux/actions";
import logo from "../../assets/images/logo.png";
import menuList from "../../config/memuConfig";
const { SubMenu } = Menu;
class LeftNav extends Component {
  state = {};

  /*
  判断当前登陆用户对item是否有权限
   */
  hasAuth = item => {
    // 获取当前用户的
    const {
      username,
      role: { menus }
    } = this.props.user;
    /**
     * admin 用户显示所有
     * isPublic 为公用菜单，向所有人开放
     * 用户权限数组中不存在不显示
     */
    if (
      username === "admin" ||
      item.isPublic ||
      menus.indexOf(item.key) !== -1
    ) {
      return true;
    } else if (item.children) {
      // 如果当前用户有此item的某个子item的权限
      return !!item.children.find(item => menus.indexOf(item.key) !== -1);
    } else {
      return false;
    }
  };

  /**
   * 采用 array reduce遍历方法，实现累计往 pre 数组中添加新下内容
   * 在遍历的过程中，判断二级菜单栏的 key 是否与当前路径相同
   * 如果一致则记录一级菜单栏的 key
   */
  getMenuNodes = menuList => {
    const { pathname } = this.props.location;
    return menuList.reduce((pre, item) => {
      // 判断当前用户是否有这个权限使用菜单
      if (this.hasAuth(item)) {
        const { title, key, icon, children } = item;
        if (children) {
          const citem = children.find(
            citem => pathname.indexOf(citem.key) !== -1
          );
          if (citem) {
            this.openKey = item.key;
          }

          pre.push(
            <SubMenu
              key={key}
              title={
                <span>
                  <Icon type={icon} />
                  <span>{title}</span>
                </span>
              }
            >
              {this.getMenuNodes(children)}
            </SubMenu>
          );
        } else {
          if (pathname === item.key || pathname.indexOf(item.key) !== -1) {
            this.props.setHeadTitle(item.title);
          }
          pre.push(
            <Menu.Item key={key}>
              <Link
                to={key}
                onClick={() => this.props.setHeadTitle(item.title)}
              >
                <Icon type={icon} />
                <span>{title}</span>
              </Link>
            </Menu.Item>
          );
        }
      }
      return pre;
    }, []);
  };

  /**
   * 在执行 render 之前，准备好菜单栏数据，用于初始化渲染
   * 一般用于初始化同步数据
   * componentDidMount 则用于初始化异步数据，包含：ajax请求，关闭计时器等
   */
  UNSAFE_componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  }
  /**
   * 通过 getMenuNodes 递归添加子项
   * 通过 selectedKeys 设置选择的栏目
   * defaultOpenKeys 设置打开的二级菜单栏，值为一级菜单栏
   */
  render() {
    let { pathname } = this.props.location;
    const openKey = this.openKey;
    if (pathname.indexOf("/product") === 0) {
      pathname = "/product";
    }

    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt="logo"></img>
          <h1>React 后台</h1>
        </Link>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={[openKey]}
        >
          {this.menuNodes}
        </Menu>
      </div>
    );
  }
}

/**
 * withRouter 高阶组件
 * 包装非路由组件，传递 history/location/mathc属性
 *
 * 非路由组件:不是用过 router 跳转的组件
 *
 * connect 高阶组件
 * 将state 一般属性传递给 UI组件的props属性
 * 将state 函数属性传递给UI组件的props属性
 */

export default connect(
  state => ({ user: state.user }),
  { setHeadTitle }
)(withRouter(LeftNav));
