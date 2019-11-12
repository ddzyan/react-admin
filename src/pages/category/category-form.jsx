import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Select, Input } from "antd";

const Item = Form.Item;
const Option = Select.Option;

class CategoryForm extends Component {
  state = {};

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 通过函数形式向父级传递 form 属性，使之可以获得输入内容
    categorys: PropTypes.array.isRequired, // 获取需要显示的分类列表，用于选择添加
    selectCategory: PropTypes.object.isRequired, // 获取需要显示的分类列表，用于选择添加
    parentId: PropTypes.string.isRequired
  };

  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form);
  }

  render() {
    const {
      form: { getFieldDecorator },
      categorys,
      selectCategory,
      parentId
    } = this.props;
    const fromStyle = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 }
    };
    return (
      <Form>
        {!selectCategory.id ? (
          <Item label="所属链" {...fromStyle}>
            {getFieldDecorator("parentId", {
              initialValue: parentId
            })(
              <Select>
                <Option value="0">一级分类列表</Option>
                {categorys.map((item, index) => (
                  <Option key={index} value={item.id}>
                    {item.chainName}
                  </Option>
                ))}
              </Select>
            )}
          </Item>
        ) : null}
        <Item label="链名称" {...fromStyle}>
          {getFieldDecorator("chainName", {
            initialValue: selectCategory.chainName
              ? selectCategory.chainName
              : "",
            rules: [
              { required: true, message: "链名称必须输入" },
              { max: 12, message: "链名称需要小于12位" }
            ]
          })(<Input placeholder="请输入链名称"></Input>)}
        </Item>
        <Item label="链符号" {...fromStyle}>
          {getFieldDecorator("currencyName", {
            initialValue: selectCategory.currencyName
              ? selectCategory.currencyName
              : "",
            rules: [
              { required: true, message: "链符号必须输入" },
              { max: 12, message: "链符号需要小于12位" }
            ]
          })(<Input placeholder="请输入链符号"></Input>)}
        </Item>
        <Item label="浏览器地址" {...fromStyle}>
          {getFieldDecorator("explorer", {
            initialValue: selectCategory.explorer
              ? selectCategory.explorer
              : "",
            rules: [{ max: 250, message: "浏览器地址需要小于250位" }]
          })(<Input placeholder="请输入浏览器地址"></Input>)}
        </Item>
      </Form>
    );
  }
}

const WrapCategoryFormm = Form.create()(CategoryForm);

export default WrapCategoryFormm;
