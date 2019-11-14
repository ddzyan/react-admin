import React, { Component } from "react";
import { Card, Select, Table, Input, Button, Icon, message } from "antd";

import { delProduct } from "../../api";
import LinkButton from "../../components/link-button";
import {
  getProductList,
  searchProductList,
  updateProductStatus
} from "../../api";
import { PAGE_SIZE } from "../../config/constantConfig";

const Option = Select.Option;
class ProductHome extends Component {
  state = {
    loading: true,
    total: 0,
    products: [],
    searchType: "productDesc",
    searchValue: ""
  };

  // 更新商品状态
  updateProductStatus = async product => {
    const response = await updateProductStatus(
      product._id,
      product.status === 1 ? 0 : 1
    );
    if (response && response.status === 0) {
      message.success("更新成功");
      this.getProducts(this.pageNum);
    } else {
      message.error("更新失败");
    }
  };

  // 初始化表单标题
  initColumns = () => {
    this.columns = [
      {
        title: "账号",
        dataIndex: "account"
      },
      {
        title: "地址",
        dataIndex: "address"
      },
      {
        title: "公钥",
        dataIndex: "publicKey"
      },
      {
        title: "所属链",
        dataIndex: "chainName"
      },
      {
        title: "余额",
        dataIndex: "balance"
      },
      {
        title: "状态",
        width: 100,
        //dataIndex: "status",  如歌值为状态则无法获得商品ID
        render: product => {
          return (
            <span>
              <Button
                type="primary"
                onClick={() => {
                  this.updateProductStatus(product);
                }}
              >
                {product.state ? "关闭" : "激活"}
              </Button>
              <span>{product.state ? "激活" : "关闭"}</span>
            </span>
          );
        }
      },
      {
        width: 100,
        title: "操作",
        render: account => {
          return (
            <div>
              <LinkButton
                onClick={() =>
                  this.props.history.push("/account/detail", account)
                }
              >
                详情
              </LinkButton>
              <LinkButton
                onClick={() =>
                  /**
                   * 此语法只支持browerRouter
                   * 通过传入第二个参数，将 product 对象传递到子组件
                   */
                  this.props.history.push("/account/update", account)
                }
              >
                修改
              </LinkButton>

              <LinkButton onClick={() => this.delProduct(account.id)}>
                删除
              </LinkButton>
            </div>
          );
        }
      }
    ];
  };

  // 删除商品
  delProduct = async _id => {
    const response = await delProduct(_id);
    if (response.status === 0) {
      message.success("删除成功");
      this.getProducts(1);
    } else {
      message.error("删除失败");
    }
  };

  // 根据 pageNum(当前页码)) 和 pageSize(一页显示的数量) 获取表单列表
  getProducts = async current => {
    this.setState({
      loading: true
    });
    // 更新显示的页码
    this.pageNum = current;
    const { searchType, searchValue } = this.state;
    let response;
    // 判读是否需要根据输入的关键字进行过滤
    if (searchValue.length > 0) {
      response = await searchProductList(
        this.pageNum,
        PAGE_SIZE,
        searchValue,
        searchType
      );
    } else {
      response = await getProductList(this.pageNum, PAGE_SIZE);
    }

    if (response && response.status === 0) {
      const { list, total } = response.data;
      this.setState({
        loading: false,
        products: list,
        total
      });
    } else {
      message.error("获取商品列表失败");
    }
  };

  /**
   * 执行异步初始化
   * 初始化获得 商品列表 时候，需要传入当前页码，不然将为undefind
   */
  componentDidMount() {
    this.getProducts(1);
  }

  //执行同步初始化
  UNSAFE_componentWillMount() {
    this.initColumns();
  }

  /**
   * 保持 this.pageNum 的目的是为了在进行查询的时候，可以获取当前页码
   * 使用 受控组件(值由react进行管理) 获取select和input的值，并且使用this,setState进行管理更新(是有必要更新到state中？因为每次更新都将刷新页面，而实际这两个值的修改界面并没有更改)
   */
  render() {
    const { total, products, loading, searchType } = this.state;
    const title = (
      <div>
        <Select
          defaultValue={searchType}
          style={{ width: 150 }}
          onChange={value => {
            this.setState({
              searchType: value
            });
          }}
        >
          <Option value="productDesc">按照描述搜索</Option>
          <Option value="productName">按照名称搜索</Option>
        </Select>
        <Input
          style={{ width: 150, margin: 10 }}
          placeholder="查询内容"
          onChange={({ target: { value } }) =>
            this.setState({
              searchValue: value.trim()
            })
          }
        />
        <Button
          type="primary"
          onClick={() => {
            this.getProducts(1);
          }}
        >
          查询
        </Button>
      </div>
    );
    const extra = (
      <Button
        type="primary"
        onClick={() => this.props.history.push("/account/add")}
      >
        <Icon type="plus" />
        添加
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          loading={loading}
          bordered={true}
          rowKey="id"
          dataSource={products}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            defaultPageSize: PAGE_SIZE,
            total,
            onChange: this.getProducts,
            showQuickJumper: true
          }}
        />
      </Card>
    );
  }
}

export default ProductHome;
