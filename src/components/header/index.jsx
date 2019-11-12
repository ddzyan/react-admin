import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Modal } from "antd";
import { connect } from "react-redux";

import LinkButton from "../link-button";
import menuList from "../../config/memuConfig";
import { getWeather } from "../../api";
import { formateDate } from "../../utils/dateUtils";
import { resetUser } from "../../redux/actions";
import "./index.less";

const { confirm } = Modal;
class Header extends Component {
  state = {
    dayPictureUrl: "",
    weather: "",
    currentDate: ""
  };

  /**
   * componentWillMount 在生命周期内只会执行一次
   * 所以在这里获取 title 将无法更新
   */
  /* UNSAFE_componentWillMount() {
    this.getTitle();
  } */

  /**
   * 在componentDidMount 周期执行异步初始化数据操作
   * 异步操作一般为:网络通讯，文件操作，定时器
   */
  async componentDidMount() {
    const { dayPictureUrl, weather } = await getWeather("杭州");
    this.getTime();
    this.setState({
      dayPictureUrl,
      weather
    });
  }

  // 在组件即将要被取消挂载的时候，删除定时器。否则将会造成内存溢出
  componentWillUnmount() {
    clearInterval(this.dateTimer);
  }

  // 动态更新时间
  getTime() {
    this.dateTimer = setInterval(() => {
      const currentDate = formateDate(new Date());
      this.setState({ currentDate });
    }, 1000);
  }

  /**
   * 使用递归查询获得匹配的title
   * 使用 forof 循环，而不是 foreach 因为 foreach 无法在获得匹配内容后跳出，必须循环全部，造成资源浪费
   */
  recursiveQueryTitle = (menuList, pathname) => {
    // eslint-disable-next-line no-unused-vars
    for (const item of menuList) {
      if (pathname.indexOf(item.key) === 0) {
        return item;
      }

      if (item.children) {
        const citem = this.recursiveQueryTitle(item.children, pathname);
        if (citem) {
          return citem;
        }
      }
    }
  };

  /**
   * 采用递归查询获得匹配的 title
   */
  getTitle = () => {
    const { pathname } = this.props.location;
    const memu = this.recursiveQueryTitle(menuList, pathname);
    const title = memu ? memu.title : "";
    return title;
  };

  /**
   * antd 自带的 modal 来实现对话框退出
   * onOk 默认为普通函数，普通函数的 this 对象为使用时的 this，则无法获得 props 属性
   * 采用箭头函数方式绑定定义时的this
   */
  loginOut = () => {
    confirm({
      title: "是否退出登陆?",
      okText: "确认",
      cancelText: "取消",
      //content: "将跳转到",
      onOk: () => {
        this.props.resetUser();
      }
    });
  };

  /**
   * 由于路由跳转，每次 title 都可能变化，所以要不断更新获得匹配的 title
   * 使用 自定义 LinkButton ，解决 a 标签无效的 href 属性报警
   */
  render() {
    console.log("header render()");
    const { currentDate, dayPictureUrl, weather } = this.state;
    //const title = this.getTitle();
    const { user, headTitle } = this.props;
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎,{user.username}</span>
          <LinkButton onClick={this.loginOut}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{headTitle}</div>
          <div className="header-bottom-right">
            <span>{currentDate}</span>
            <img src={dayPictureUrl} alt="aa"></img>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * 高阶组件包装 Header，传递 history/location/match属性
 */
const WrapHeader = withRouter(Header);

export default connect(
  state => ({ headTitle: state.headTitle, user: state.user }),
  { resetUser }
)(WrapHeader);
