import React, { Component } from "react";
import { Card, Input, Button, Icon, Form, message, Cascader } from "antd";

import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";
import LinkButton from "../../components/link-button";
import { getCategory, AddOrUpdateProduct } from "../../api";
const { Item } = Form;
const { TextArea } = Input;

// 商品的添加和更新
class ProductAddUpdate extends Component {
  state = {
    options: []
  };

  constructor(props) {
    super(props);
    this.pw = React.createRef();
    this.editor = React.createRef();
  }

  /**
   * 初始化分类级联菜单
   * 如果是修改界面并且product的一级分类(pCategoryId) 不为0
   * 则获取二级分类，并且添加到 对应一级分类的 children 属性中
   * 更新 state 用于默认选中 一级/二级分类
   */
  initOptions = async options => {
    const {
      product: { pCategoryId },
      isUpdate
    } = this;
    // 更新信息界面，判断二级分类 pCategoryId 是否0
    if (isUpdate && pCategoryId !== "0") {
      // 获取产品二级分类ID的列表信息

      const childOptions = await this.getCategory(pCategoryId);

      // 找出当前商品匹配的一级菜单
      const targetOption = options.find(option => option.value === pCategoryId);
      targetOption.children = childOptions;
    }
    // options 为一个新的对象，此是可以直接赋值
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
      const options = response.data.map(({ name, _id }) => ({
        value: _id,
        label: name,
        isLeaf: parentId === 0 ? false : true
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
        // 获得上传的图片名称数组
        const pw = this.pw.current;
        // 获得输入的富文本内容
        const editor = this.editor.current;
        const { categorys, name, desc, price } = value;
        let categoryId, pCategoryId;
        if (categorys.length === 2) {
          categoryId = categorys[1];
          pCategoryId = categorys[0];
        } else {
          pCategoryId = categorys[0];
        }
        const imgs = pw.getFileList();
        const detail = editor.getDetail();

        let product = {
          categoryId,
          pCategoryId,
          name,
          desc,
          price,
          imgs,
          detail
        };
        // 判断是更新还是添加
        if (this.isUpdate) {
          product._id = this.product._id;
        }
        const response = await AddOrUpdateProduct(product);
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
    if (Number.parseInt(value) > 0) {
      callback();
    } else {
      callback("商品价格必须大于0");
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
  UNSAFE_componentWillMount() {
    const product = this.props.location.state;
    this.isUpdate = !!product;
    this.product = product || {};
  }

  render() {
    /**
     * 初始化执行一次渲染
     * 异步获取到分类列表时，执行第二次渲染
     */
    console.log("add-update render");
    const { getFieldDecorator } = this.props.form;
    const { product, isUpdate } = this;
    const {
      pCategoryId,
      categoryId,
      name,
      desc,
      price,
      imgs,
      detail
    } = product;
    const categoryIds = [];
    if (isUpdate) {
      if (pCategoryId !== "0") {
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      } else {
        categoryIds.push(categoryId);
      }
    }
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

    /**
     * 使用 antd 栅格布局，满格为24
     */
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    };

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称:">
            {getFieldDecorator("name", {
              initialValue: name,
              rules: [{ required: true, message: "商品名称不能为空" }]
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述:">
            {getFieldDecorator("desc", {
              initialValue: desc,
              rules: [{ required: true, message: "商品描述不能为空" }]
            })(
              <TextArea
                placeholder="请输入商品描述"
                autosize={{ maxRows: 6, minRows: 2 }}
              />
            )}
          </Item>
          <Item label="商品价格:">
            {getFieldDecorator("price", {
              initialValue: price,
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
          <Item label="商品类别">
            {getFieldDecorator("categorys", {
              initialValue: categoryIds,
              rules: [{ required: true, message: "商品类别不能为空" }]
            })(
              <Cascader
                placeholder="请选择商品分类"
                options={this.state.options} /**显示需要显示的数据数组 */
                loadData={this.loadData}
              />
            )}
          </Item>
          <Item label="图片上传">
            <PicturesWall imgs={imgs} ref={this.pw} />
          </Item>

          <Item
            label="商品详情"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor detail={detail} ref={this.editor} />
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
