import React, { Component } from "react";
import { Row, Col, Button } from "antd";
import { connect } from "react-redux";

import { setHeadTitle } from "../../redux/actions";
import "./not-found.less";
class NotFound extends Component {
  state = {};

  clickHandle = () => {
    this.props.setHeadTitle("首页");
    this.props.history.replace("/home");
  };

  render() {
    return (
      <Row className="not-found">
        <Col span={12} className="left"></Col>
        <Col span={12} className="right">
          <h1>404</h1>
          <h2>抱歉,你访问的页面不存在</h2>
          <Button type="primary" onClick={this.clickHandle}>
            回到首页
          </Button>
        </Col>
      </Row>
    );
  }
}

export default connect(
  null,
  { setHeadTitle }
)(NotFound);
