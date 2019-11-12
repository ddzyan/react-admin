import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

const Item = Form.Item;
class UpdateForm extends Component {
  state = {};

  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  };

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form);
  }

  // 组件即将被卸载的生命周期
  componentWillUnmount() {}

  render() {
    const categoryName = this.props.categoryName;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Item>
          {getFieldDecorator("categoryName", {
            initialValue: categoryName,
            rules: [
              { required: true, message: "分类名称必须输入" },
              { max: 12, message: "分类名称需要小于12位" },
              { pattern: /^[\u4e00-\u9fa5]+$/, message: "分类名称必须是中文" }
            ]
          })(<Input placeholder="请输入分类名称"></Input>)}
        </Item>
      </Form>
    );
  }
}

const WrapUpdateForm = Form.create()(UpdateForm);

export default WrapUpdateForm;
