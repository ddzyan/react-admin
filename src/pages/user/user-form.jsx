import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input, Select } from "antd";

const { Item } = Form;
const { Option } = Select;

class UserForm extends Component {
  static propTypes = {
    user: PropTypes.object,
    roles: PropTypes.array.isRequired,
    setForm: PropTypes.func.isRequired
  };

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form);
  }

  state = {};
  render() {
    const { roles, user } = this.props;
    console.log("roles :", roles);
    const { getFieldDecorator } = this.props.form;
    const fromStyle = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 }
    };

    return (
      <Form>
        <Item label="用户名:" {...fromStyle}>
          {getFieldDecorator("username", {
            initialValue: user.username,
            rules: [
              { required: true, message: "用户名称必须驶入" },
              { min: 4, message: "用户名不能小于4位数" },
              { max: 12, message: "用户名不能大于12位数" }
            ]
          })(<Input placeholder="请输入用户名称" />)}
        </Item>
        {user.id ? null : (
          <Item label="密码:" {...fromStyle}>
            {getFieldDecorator("password", {
              initialValue: user.password,
              rules: [
                { required: true, message: "密码必须输入" },
                { min: 4, message: "用户名不能小于4位数" },
                { max: 12, message: "用户名不能大于12位数" }
              ]
            })(<Input type="password" placeholder="请输入密码" />)}
          </Item>
        )}
        <Item label="手机号:" {...fromStyle}>
          {getFieldDecorator("phone", { initialValue: user.phone })(
            <Input placeholder="请输入手机号码" />
          )}
        </Item>
        <Item label="邮箱:" {...fromStyle}>
          {getFieldDecorator("email", { initialValue: user.email })(
            <Input placeholder="请输入邮箱地址" />
          )}
        </Item>
        <Item label="角色:" {...fromStyle}>
          {getFieldDecorator("roleId", {
            initialValue: roles.length > 0 ? roles[0].id : ""
          })(
            <Select>
              {roles.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          )}
        </Item>
      </Form>
    );
  }
}

const WrapAddForm = Form.create()(UserForm);
export default WrapAddForm;
