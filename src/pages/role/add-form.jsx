import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

const { Item } = Form;

/**
 * 添加角色组件
 * 这里不使用 PureComponent 来优化渲染是因为
 * 在父组件执行关闭的时候，清空了 form 组件的输入内容，从而使内部管理的数据进行了变化，所以需要重新渲染
 */

class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired
  };
  state = {};

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    console.log("add-form render()");
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
        <Item label="角色名称:">
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "用户名称必须输入" }]
          })(<Input placeholder="请输入角色名称" />)}
        </Item>
      </Form>
    );
  }
}

const WrapAddForm = Form.create()(AddForm);

export default WrapAddForm;
