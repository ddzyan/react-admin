import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Form, Icon, Input, Button, message } from "antd";

import { userLogin } from "../../redux/actions";
import logo from "../../assets/images/logo.png";
import "./login.less";

const { Item } = Form;

class Login extends Component {
  /**
   * 表单提交事件
   * 1.关闭默认事件
   * 2.判断表单验证是否通过
   * 3.调用 redux action 登陆请求
   */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((error, value) => {
      if (!error) {
        const { username, password } = value;
        // 使用 redux 完成登陆
        this.props.userLogin(username, password);
        /**
         * this.props.history.replace("/home");
         * 无需再进行页面跳转，等待 state 状态刷新，会执行 render()
         * 然后再判断 user 属性 判断是否登陆成功
         */
      } else {
        message.error("验证失败");
      }
    });
  };

  /**
   * value 输入的内容
   * callback 回调内包含字符串则表示验证失败
   * callback 不包含则代表回调成功
   */
  validator = (rule, value, callback) => {
    if (!value) {
      callback("密码不能为空");
    } else if (value.length > 12) {
      callback("密码不能大于12位");
    } else if (value.length < 4) {
      callback("密码不能小于4位");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback("密码只能为密码数字下划线组成");
    } else {
      callback();
    }
  };

  render() {
    /**
     * 当 redux 管理的 user 对象进行更新
     * 会执行 render()判断是否已经登陆
     * 如果登陆则直接跳转 /home
     */
    const user = this.props.user;
    if (user && user.id) {
      return <Redirect to="/home" />;
    }

    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <header className="login-title">
          <img src={logo} alt="logo"></img>
          <h1>React 后台登陆系统</h1>
        </header>
        <section className="login-content">
          <div className={!user.errorMessage ? "error-msg" : "error-msg show"}>
            {user.errorMessage}
          </div>
          <h2>登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "用户名必须输入"
                  },
                  { min: 4, message: "用户名不能小于4位数" },
                  { max: 12, message: "用户名不能大于12位数" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </Item>
            <Item>
              {getFieldDecorator("password", {
                rules: [{ validator: this.validator }]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登陆
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    );
  }
}

const WrapLogin = Form.create()(Login);

export default connect(
  state => ({ user: state.user }),
  { userLogin }
)(WrapLogin);
