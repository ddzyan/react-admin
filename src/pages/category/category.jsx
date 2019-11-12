import React, { Component } from "react";
import { Card, Button, Icon, Table, message, Modal } from "antd";

import "./category.less";
import LinkButton from "../../components/link-button";
import { getCategory, updateCategory, addCategory } from "../../api";
import AddForm from "./category-form";
class Category extends Component {
  state = {
    loading: true, //是否显示加载动画
    selectCategory: {}, // 选择中的分类对象,用于传递给更新组件的categoryName
    categorys: [], // 一级分类列表
    subCategorys: [], // 二级分类列表
    parentId: "0", // 选择的分类ID
    parentName: "", // 选择中的分类名称,用于更新title
    modalVisible: 0 // 控制显示modal控件,0隐藏,1显示添加,2显示修改
  };

  // 初始化异步数据
  componentDidMount() {
    this.getCategorys();
  }
  // 初始化同步数据
  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  //显示二级分类列表的点击事件
  showSubCategorys = ({ id, chainName }) => {
    this.setState(
      {
        parentId: id,
        parentName: chainName
      },
      () => {
        this.getCategorys();
      }
    );
  };

  /**
   * 初始化表格的标题内容，因为可能将内容写道配置文件中
   * 在添加按钮标签时候，判断 parentId 来区别是否要添加查看子分类按钮
   */
  initColumns = () => {
    this.columns = [
      {
        title: "链名称",
        dataIndex: "chainName"
      },
      {
        title: "链符号",
        dataIndex: "currencyName"
      },
      {
        title: "浏览器地址",
        dataIndex: "explorer",
        render: url => (
          <a href={url} rel="noopener noreferrer" target="_blank">
            {url}
          </a>
        )
      },
      {
        title: "操作",
        width: 300,
        render: category => (
          <span>
            <LinkButton onClick={() => this.showUpdateModal(category)}>
              修改分类
            </LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton onClick={() => this.showSubCategorys(category)}>
                查看子分类
              </LinkButton>
            ) : (
              ""
            )}
          </span>
        )
      }
    ];
  };

  // 获取一级/二级分类列表
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

  /**
   * 显示更新弹窗
   * 由于更新 selectCategory ，不需要进行页面重新渲染
   * 则不将此属性添加到 state 中
   */
  showUpdateModal = category => {
    this.selectCategory = category;
    this.setState({
      modalVisible: 1
    });
  };

  // 显示添加弹窗
  showAddModal = () => {
    this.selectCategory = {};
    this.setState({
      modalVisible: 1
    });
  };

  // 显示一级分类菜单
  showCategorys = () => {
    this.setState({
      subCategorys: [],
      parentId: "0",
      parentName: ""
    });
  };

  // 关闭添加或者更新弹窗
  closeModal = () => {
    this.form.resetFields();
    this.setState({
      modalVisible: 0
    });
  };

  /**
   * 添加分类列表
   * 如果添加的分类，不是当前分类列表则不进行刷新
   * 如果是在二级分类列表，添加一级分类，需要进行刷新，并且传入刷新的分类ID
   */
  submint = () => {
    this.form.validateFields(async (error, value) => {
      if (!error) {
        const { parentId, chainName, currencyName, explorer } = value;
        let response;
        this.closeModal();
        if (parentId) {
          response = await addCategory(
            chainName,
            currencyName,
            explorer,
            Number.parseInt(parentId)
          );
        } else {
          response = await updateCategory(
            chainName,
            currencyName,
            explorer,
            this.selectCategory.id
          );
        }

        if (response.status === 0) {
          if (this.state.parentId === parentId) {
            this.getCategorys();
          } else if (parentId === "0") {
            this.getCategorys(0);
          }
          message.success(`${parentId ? "添加" : "修改"}成功`);
        } else {
          message.success(`${parentId ? "添加" : "修改"}失败`);
        }
      } else {
        message.error("验证失败");
      }
    });
  };

  /**
   * 通过获得分类接口，异步加载表格内容
   * 判断分类ID是否为0，来决定显示一级/二级分类
   *
   * 通过向子组件 updateForm 传递函数的方式，获取子组件的 form 对象，用来获取用户输入的值
   */

  render() {
    const {
      loading,
      categorys,
      parentId,
      parentName,
      subCategorys
    } = this.state;
    // 防止在第一次渲染的时候，selectCategory 对象为 undefind，导致的获取 name 报错
    const category = this.selectCategory ? this.selectCategory : {};
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类菜单</LinkButton>
          <Icon type="arrow-right" style={{ marginRight: "5px" }}></Icon>
          <span>{parentName}</span>
        </span>
      );
    const extra = (
      <Button type="primary" onClick={() => this.showAddModal()}>
        <Icon type="plus"></Icon>
        添加
      </Button>
    );

    return (
      <div className="category">
        <Modal
          title={category.id ? "修改分类" : "添加分类"}
          cancelText={"取消"}
          okText={"确认"}
          visible={this.state.modalVisible === 1}
          onOk={this.submint}
          onCancel={() => this.closeModal()}
        >
          <AddForm
            selectCategory={category}
            categorys={categorys}
            parentId={parentId}
            setForm={form => {
              this.form = form;
            }}
          />
        </Modal>
        <Card title={title} className="category-card" extra={extra}>
          <Table
            bordered
            pagination={{ defaultPageSize: 5, showQuickJumper: true }}
            loading={loading}
            columns={this.columns}
            dataSource={parentId === "0" ? categorys : subCategorys}
            rowKey="id"
          />
        </Card>
      </div>
    );
  }
}

export default Category;
