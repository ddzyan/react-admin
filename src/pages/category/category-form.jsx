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
              { max: 10, message: "链名称需要小于12位" }
            ]
          })(<Input placeholder="请输入链名称"></Input>)}
        </Item>
        <Item label="币种符号" {...fromStyle}>
          {getFieldDecorator("currencyName", {
            initialValue: selectCategory.currencyName
              ? selectCategory.currencyName
              : "",
            rules: [
              { required: true, message: "币种符号必须输入" },
              { max: 10, message: "币种符号需要小于10位" }
            ]
          })(<Input placeholder="请输入币种符号"></Input>)}
        </Item>
        <Item label="小数位数" {...fromStyle}>
          {getFieldDecorator("decimal", {
            initialValue:
              selectCategory.decimal !== undefined
                ? selectCategory.decimal
                : "",
            rules: [
              { required: true, message: "小数位数必须输入" },
              { max: 20, message: "小数位数需要小于20位" }
            ]
          })(<Input placeholder="请输入小数位数"></Input>)}
        </Item>
        <Item label="浏览器地址" {...fromStyle}>
          {getFieldDecorator("explorer", {
            initialValue: selectCategory.explorer
              ? selectCategory.explorer
              : "",
            rules: [{ max: 250, message: "浏览器地址需要小于250位" }]
          })(<Input placeholder="请输入浏览器地址"></Input>)}
        </Item>
        <Item label="合约地址" {...fromStyle}>
          {getFieldDecorator("contract", {
            initialValue: selectCategory.contract
              ? selectCategory.contract
              : "",
            rules: [{ max: 255, message: "合约地址需要小于250位" }]
          })(<Input placeholder="请输入合约地址"></Input>)}
        </Item>
        <Item label="余额模型" {...fromStyle}>
          {getFieldDecorator("balanceType", {
            initialValue: selectCategory.balanceType
              ? selectCategory.balanceType
              : 1
          })(
            <Select>
              <Option value={2}>余额模型</Option>
              <Option value={1}>UTXO模型</Option>
            </Select>
          )}
        </Item>
        <Item label="状态" {...fromStyle}>
          {getFieldDecorator("state", {
            initialValue:
              selectCategory.state !== undefined ? selectCategory.state : "1"
          })(
            <Select>
              <Option value="1">启用</Option>
              <Option value="0">关闭</Option>
            </Select>
          )}
        </Item>
      </Form>
    );
  }
}

const WrapCategoryFormm = Form.create()(CategoryForm);

export default WrapCategoryFormm;
