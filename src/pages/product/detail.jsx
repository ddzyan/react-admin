import React, { Component } from "react";
import { Card, Icon, List, Button } from "antd";
import { Redirect } from "react-router-dom";

import { BASE_IMG_URL } from "../../config/constantConfig";
import { getCategoryInfo } from "../../api";
const Item = List.Item;

// 商品详情
class ProductDetail extends Component {
  state = {
    categoryName: "",
    subCategoryName: ""
  };

  /**
   * 异步初始化
   * 使用 并发 一起获取分类名称（未处理失败情况）
   * 如果二级分类为空则只获取一个
   */
  async componentDidMount() {
    if (!this.props.location.state) {
      return <Redirect to="/product" />;
    }
    const { categoryId, pCategoryId } = this.props.location.state;
    if (pCategoryId === "0") {
      const response = await getCategoryInfo(categoryId);
      const categoryName = response.data.name;
      this.setState({ categoryName });
    } else {
      const responses = await Promise.all([
        getCategoryInfo(categoryId),
        getCategoryInfo(pCategoryId)
      ]);

      const categoryName = responses[0].data.name;
      const subCategoryName = responses[1].data.name;

      this.setState({
        categoryName,
        subCategoryName
      });
    }
  }

  render() {
    if (!this.props.location.state) {
      return <Redirect to="/product" />;
    }
    const { name, desc, detail, imgs, price } = this.props.location.state;

    const { categoryName, subCategoryName } = this.state;

    const title = (
      <span>
        <Button type="primary" onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" />
          后退
        </Button>
      </span>
    );
    return (
      <Card title={title} className="product-detail">
        <List>
          <Item>
            <span className="title">商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="title">商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="title">商品价格:</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className="title">所属分类:</span>
            <span>
              {categoryName} {subCategoryName ? "-->" + subCategoryName : ""}
            </span>
          </Item>
          <Item>
            <span className="title">所属图片:</span>
            {imgs.map((item, index) => (
              <img key={index} src={`${BASE_IMG_URL}${item}`} alt="1" />
            ))}
          </Item>
          <Item>
            <span className="title">所属分类:</span>
            <div
              dangerouslySetInnerHTML={{
                __html: detail
              }}
            />
          </Item>
        </List>
      </Card>
    );
  }
}

export default ProductDetail;
