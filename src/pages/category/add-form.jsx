import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Select, Input } from "antd";

const Item = Form.Item;
const Option = Select.Option;

class AddForm extends Component {
  state = {};

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 通过函数形式向父级传递 form 属性，使之可以获得输入内容
    categorys: PropTypes.array.isRequired, // 获取需要显示的分类列表，用于选择添加
    parentId: PropTypes.string.isRequired // 用于显示默认选择的分类，不设置0，是因为可能是在二级菜单点击添加跳转
  };

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    const {
      form: { getFieldDecorator },
      categorys,
      parentId
    } = this.props;
    return (
      <Form>
        <Item>
          {getFieldDecorator("parentId", { initialValue: parentId })(
            <Select>
              <Option value="0">一级分类列表</Option>
              {categorys.map((item, index) => (
                <Option key={index} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </Item>
        <Item>
          {getFieldDecorator("categoryName", {
            initialValue: "",
            rules: [
              { required: true, message: "分类名称必须输入" },
              {
                max: 10,
                message: "分类名称需要小于10位"
              },
              { pattern: /^[\u4e00-\u9fa5]+$/, message: "分类名称只能是中文" }
            ]
          })(<Input placeholder="请输入分类名称"></Input>)}
        </Item>
      </Form>
    );
  }
}

const WrapAddForm = Form.create()(AddForm);

export default WrapAddForm;
