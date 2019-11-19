import React, { Component } from "react";
import { Form, Card, Icon, Input, Select, message, Button } from "antd";

import PicturesWall from "./pictures-wall";
import LinkButton from "../../components/link-button";
import { addCategory, getCategory, updateCategory } from "../../api";
const { Item } = Form;
const { Option } = Select;

class AddUpdate extends Component {
  constructor(props) {
    super(props);
    this.pw = React.createRef();
  }

  state = {
    parentId: "0",
    categorys: []
  };

  componentWillMount() {
    const state = this.props.location.state;
    if (typeof state === "object") {
      this.chain = state || {};
      this.selectParentId = "0";
    } else {
      this.selectParentId = state;
      this.chain = {};
    }
  }

  getCategorys = async parentId => {
    parentId = parentId || this.state.parentId;
    const result = await getCategory(parentId);
    if (result && result.status === 0) {
      const categorys = result.data;
      if (Object.is(parentId, "0")) {
        this.setState({
          loading: false,
          categorys
        });
      } else {
        this.setState({
          loading: false,
          subCategorys: categorys
        });
      }
    } else {
      message.error("获取分类列表失败");
    }
  };

  componentDidMount() {
    this.getCategorys();
  }

  submit = () => {
    this.props.form.validateFields(async (error, value) => {
      if (error) {
        message.error("验证失败");
      } else {
        const pw = this.pw.current;
        const imgs = pw.getFileList();
        if (!this.chain.id) {
          await this.add({ ...value, imageUrl: imgs[0] });
        } else {
          await this.update({ ...value, imageUrl: imgs[0] });
        }
      }
    });
  };

  update = async value => {
    const {
      chainName,
      currencyName,
      explorer,
      contract,
      balanceType,
      state,
      decimal,
      imageUrl
    } = value;

    const response = await updateCategory(
      Number.parseInt(this.chain.id),
      chainName,
      currencyName,
      explorer,
      contract,
      Number.parseInt(balanceType),
      Number.parseInt(state),
      Number.parseInt(decimal),
      imageUrl
    );
    if (response.status === 0) {
      this.props.history.push("/chain");
      message.success("修改成功");
    } else {
      message.error("修改失败");
    }
  };

  add = async value => {
    const {
      parentId,
      chainName,
      currencyName,
      explorer,
      contract,
      balanceType,
      state,
      decimal,
      imageUrl
    } = value;
    const response = await addCategory(
      chainName,
      currencyName,
      explorer,
      contract,
      Number.parseInt(balanceType),
      Number.parseInt(state),
      Number.parseInt(decimal),
      Number.parseInt(parentId),
      imageUrl
    );
    if (response.status === 0) {
      this.props.history.push("/chain");
      message.success("添加成功");
    } else {
      message.error("添加失败");
    }
  };

  render() {
    const {
      parentId,
      state,
      explorer,
      decimal,
      currencyName,
      contract,
      chainName,
      imageUrl,
      balanceType
    } = this.chain;
    console.log("imageUrl :", imageUrl);
    const selectParentId = parentId ? parentId : this.selectParentId;
    const { getFieldDecorator } = this.props.form;
    const { categorys } = this.state;
    const title = (
      <span>
        <LinkButton
          onClick={() => this.props.history.replace("/chain", selectParentId)}
        >
          <Icon type="arrow-left" style={{ fontSize: 15 }}></Icon>
        </LinkButton>
        <span style={{ fontSize: 15 }}>返回</span>
      </span>
    );

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    };
    return (
      <Card title={title}>
        <Form>
          {!this.chain.id ? (
            <Item label="所属链" {...formItemLayout}>
              {getFieldDecorator("parentId", {
                initialValue: selectParentId || "0",
                rules: [{ required: true, message: "请选择所属链" }]
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
          <Item label="链名称" {...formItemLayout}>
            {getFieldDecorator("chainName", {
              initialValue: chainName,
              rules: [
                {
                  required: true,
                  message: "链名称不能为空"
                },
                {
                  max: 10,
                  message: "长度不能超过10"
                }
              ]
            })(<Input placeholder="请输出链名称"></Input>)}
          </Item>
          <Item label="币种符号" {...formItemLayout}>
            {getFieldDecorator("currencyName", {
              initialValue: currencyName,
              rules: [
                {
                  required: true,
                  message: "币种符号不能为空"
                },
                {
                  max: 10,
                  message: "长度不能超过10"
                }
              ]
            })(<Input placeholder="请输出币种符号"></Input>)}
          </Item>
          <Item label="小数位数" {...formItemLayout}>
            {getFieldDecorator("decimal", {
              initialValue: decimal,
              rules: [
                { required: true, message: "小数位数必须输入" },
                { max: 20, message: "小数位数需要小于20位" }
              ]
            })(<Input placeholder="请输入小数位数"></Input>)}
          </Item>
          <Item label="余额模型" {...formItemLayout}>
            {getFieldDecorator("balanceType", {
              initialValue: balanceType || "1",
              rules: [{ required: true, message: "请选择余额模型" }]
            })(
              <Select>
                <Option value="2">余额模型</Option>
                <Option value="1">UTXO模型</Option>
              </Select>
            )}
          </Item>
          <Item label="状态" {...formItemLayout}>
            {getFieldDecorator("state", {
              initialValue: state || "1",
              rules: [
                {
                  required: true,
                  message: "请选择状态"
                }
              ]
            })(
              <Select>
                <Option value="1">启用</Option>
                <Option value="0">关闭</Option>
              </Select>
            )}
          </Item>
          <Item label="合约地址" {...formItemLayout}>
            {getFieldDecorator("contract", {
              initialValue: contract || "",
              rules: [
                {
                  max: 255,
                  message: "长度不能超过255"
                }
              ]
            })(<Input placeholder="请输出合约地址"></Input>)}
          </Item>
          <Item label="浏览器地址" {...formItemLayout}>
            {getFieldDecorator("explorer", {
              initialValue: explorer || "",
              rules: [{ max: 250, message: "浏览器地址需要小于250位" }]
            })(<Input placeholder="请输入浏览器地址"></Input>)}
          </Item>
          <Item label="图标" {...formItemLayout}>
            <PicturesWall imageUrl={imageUrl} ref={this.pw}></PicturesWall>
          </Item>
          <Button type="primary" onClick={this.submit}>
            提交
          </Button>
        </Form>
      </Card>
    );
  }
}

const WrapAddUpdate = Form.create()(AddUpdate);

export default WrapAddUpdate;
