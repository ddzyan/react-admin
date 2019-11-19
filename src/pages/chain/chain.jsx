import React, { Component } from "react";
import { Card, Button, Icon, Table, message, Modal } from "antd";
import LinkButton from "../../components/link-button";
import { getCategory, delCategory } from "../../api";
const { confirm } = Modal;
class ChainHome extends Component {
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
  componentWillMount() {
    const parentId = this.props.location.state;
    this.setState({
      parentId: parentId || "0"
    });

    this.initColumns();
  }

  //显示二级分类列表的点击事件
  showSubCategorys = ({ id, chainName }) => {
    this.setState(
      {
        parentId: id.toString(),
        parentName: chainName,
        loading: true
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
        title: "币种符号",
        dataIndex: "currencyName"
      },
      {
        title: "合约地址",
        dataIndex: "contract"
      },
      {
        title: "余额模型",
        dataIndex: "balanceType",
        render: value => (value === "1" ? "UTXO模型" : "余额模型")
      },
      {
        title: "状态",
        dataIndex: "state",
        render: value => (value === "1" ? "启动" : "关闭")
      },
      {
        title: "小数位数",
        dataIndex: "decimal"
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
            <LinkButton
              onClick={() => this.props.history.push("/chain/add", category)}
            >
              修改分类
            </LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton onClick={() => this.showSubCategorys(category)}>
                查看子分类
              </LinkButton>
            ) : (
              ""
            )}
            <LinkButton onClick={() => this.showDeleteConfirm(category)}>
              删除
            </LinkButton>
          </span>
        )
      }
    ];
  };

  showDeleteConfirm = category => {
    confirm({
      title: "确认删除？",
      content: "请确认子分类，以及账号是否已经全部删除",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        const response = await delCategory(Number.parseInt(category.id));
        if (response.status === 0) {
          message.success("删除成功");
        } else {
          message.success("删除失败");
        }
        if (this.state.parentId === "0") {
          this.getCategorys(0);
        } else {
          this.getCategorys(this.state.parentId);
        }
      }
    });
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

  // 显示一级分类菜单
  showCategorys = () => {
    this.setState({
      subCategorys: [],
      parentId: "0",
      parentName: ""
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
      <Button
        type="primary"
        onClick={() =>
          this.props.history.push("/chain/add", this.state.parentId)
        }
      >
        <Icon type="plus"></Icon>
        添加
      </Button>
    );

    return (
      <div className="category">
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

export default ChainHome;
