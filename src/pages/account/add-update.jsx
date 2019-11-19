import React, { Component } from "react";
import {
  Card,
  Input,
  Button,
  Icon,
  Form,
  message,
  Cascader,
  Select
} from "antd";

import LinkButton from "../../components/link-button";
import { getCategory, AddOrUpdateProduct } from "../../api";
const { Item } = Form;
const { Option } = Select;
// 商品的添加和更新
class ProductAddUpdate extends Component {
  state = {
    options: []
  };

  initOptions = async options => {
    const {
      account: { parentId },
      isUpdate
    } = this;
    if (isUpdate && parentId !== 0) {
      const childOptions = await this.getCategory(parentId);

      const targetOption = options.find(
        option => option.value === parentId.toString()
      );
      targetOption.children = childOptions;
    }

    this.setState({
      options
    });
  };

  /**
   * 获取分类列表
   */
  getCategory = async (parentId = 0) => {
    // 获取分类列表
    const response = await getCategory(parentId);
    if (response && response.status === 0) {
      const options = response.data.map(({ chainName, id }) => ({
        value: id,
        label: chainName,
        isLeaf: parentId === "0" ? true : false
      }));
      if (parentId === 0) {
        // 初始化一级分类菜单
        this.initOptions(options);
      } else {
        // 二级列表
        return options;
      }
    } else {
      message.error("获取分类列表失败");
    }
  };

  //当选择某个选项，加载下一列的监听回调
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0]; //获得选择的项
    targetOption.loading = true; // 加载动画

    const option = await this.getCategory(targetOption.value);
    targetOption.loading = false;
    if (option && option.length > 0) {
      targetOption.children = option;
    } else {
      targetOption.isLeaf = true;
    }
    // 如果此时直接使用this.state.options ，而不是用扩展运算符，则option无法进行重写渲染
    this.setState({
      options: [...this.state.options]
    });
  };

  //提交表单
  submit = () => {
    this.props.form.validateFields(async (error, value) => {
      if (!error) {
        const {
          categorys,
          account,
          address,
          publicKey,
          balance,
          state
        } = value;
        let categoryId;
        if (categorys.length === 2) {
          categoryId = categorys[1];
        } else {
          categoryId = categorys[0];
        }

        let newAccount = {
          categoryId: Number.parseInt(categoryId),
          account,
          address,
          publicKey,
          balance: Number.parseInt(balance),
          state: Number.parseInt(state)
        };
        // 判断是更新还是添加
        if (this.isUpdate) {
          newAccount.id = this.account.id;
        }
        const response = await AddOrUpdateProduct(newAccount);
        if (response.status === 0) {
          message.success(`${this.isUpdate ? "更新" : "添加"}商品成功`);
          this.props.history.goBack();
        } else {
          message.success(`${this.isUpdate ? "更新" : "添加"}商品失败`);
        }
      } else {
        message.error("验证失败");
      }
    });
  };

  /**
   * 商品价格验证，由于已经设置了输入框类型为 Number
   * 无需判断为符合或者字母
   */
  validatePrice = (rule, value, callback) => {
    if (Number.parseInt(value) >= 0) {
      callback();
    } else {
      callback("商品价格不能小于0");
    }
  };
  /**
   * 异步初始化数据
   * 获取一级分类列表和二级分类列表
   */
  componentDidMount() {
    this.getCategory();
  }

  /**
   * 同步初始化
   * 记录商品对象和更新标记
   */
  componentWillMount() {
    const account = this.props.location.state;
    this.isUpdate = !!account;
    this.account = account || {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { account, isUpdate } = this;
    const {
      categoryId,
      account: account_info,
      address,
      publicKey,
      balance,
      state,
      parentId
    } = account;
    const title = (
      <span>
        <LinkButton
          onClick={() => {
            this.props.history.goBack();
          }}
        >
          <Icon type="arrow-left" style={{ fontSize: 15 }} />
        </LinkButton>
        <span style={{ fontSize: 15 }}>添加商品</span>
      </span>
    );
    let categoryIds = [];
    if (isUpdate) {
      if (parentId === 0) {
        categoryIds.push(categoryId.toString());
      } else {
        categoryIds.push(parentId.toString(), categoryId.toString());
      }
    }

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    };

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="账号:">
            {getFieldDecorator("account", {
              initialValue: account_info,
              rules: [{ required: true, message: "账号不能为空" }]
            })(<Input placeholder="请输入账号" />)}
          </Item>
          <Item label="地址:">
            {getFieldDecorator("address", {
              initialValue: address,
              rules: [{ required: true, message: "地址不能为空" }]
            })(<Input placeholder="请输入地址" />)}
          </Item>
          <Item label="公钥:">
            {getFieldDecorator("publicKey", {
              initialValue: publicKey,
              rules: [{ required: true, message: "公钥不能为空" }]
            })(<Input placeholder="请输入公钥" />)}
          </Item>
          <Item label="余额:">
            {getFieldDecorator("balance", {
              initialValue: balance ? balance : "0",
              rules: [
                { required: true, message: "商品价格不能为空" },
                { validator: this.validatePrice }
              ]
            })(
              <Input
                placeholder="请输入商品价格"
                type="number"
                addonAfter="元"
              />
            )}
          </Item>
          <Item label="币种">
            {getFieldDecorator("categorys", {
              initialValue: categoryIds,
              rules: [{ required: true, message: "币种不能为空" }]
            })(
              <Cascader
                placeholder="请选择币种"
                options={this.state.options} /**显示需要显示的数据数组 */
                loadData={this.loadData}
              />
            )}
          </Item>
          <Item label="状态:">
            {getFieldDecorator("state", {
              initialValue: !state ? "0" : "1",
              rules: [{ required: true, message: "状态不能为空" }]
            })(
              <Select>
                <Option key="1" value="1">
                  启动
                </Option>
                <Option key="0" value="0">
                  关闭
                </Option>
              </Select>
            )}
          </Item>
          <Button type="primary" onClick={this.submit}>
            提交
          </Button>
        </Form>
      </Card>
    );
  }
}

const WrapProductAddUpdate = Form.create()(ProductAddUpdate);

export default WrapProductAddUpdate;

/**
 * 子组件调用父组件方法：父组件将方法以函数的 props 方式传递给子组件调用
 * 父组件调用子组件方法，可以通过 ref 获取到子组件的对象，从而获得对象属性
 */
