import React, { Component } from "react";
import { Statistic, Row, Col, Divider, message, Tabs } from "antd";

import { totalAccount, totalChain } from "../../api";

import Line from "./line";
import "./home.less";
const { TabPane } = Tabs;
class Home extends Component {
  state = {
    accountCount: 0,
    chainCount: 0,
    chain: []
  };

  callback = key => {
    console.log(key);
  };

  // 异步初始化
  async componentDidMount() {
    Promise.all([totalChain(), totalAccount()])
      .then(result => {
        const [chainResult, accountResult] = result;
        let chainCount, chain, accountCount;
        if (chainResult.status === 0) {
          chainCount = chainResult.data.total;
          chain = chainResult.data.chain;
        } else {
          message.error("获取账号统计失败");
        }

        if (accountResult.status === 0) {
          accountCount = accountResult.data.total;
        } else {
          message.error("获取币种统计失败");
        }
        this.setState({
          accountCount,
          chainCount,
          chain
        });
      })
      .catch(err => {
        console.error(err);
        message.error("获取统计信息失败");
      });
  }

  render() {
    const { accountCount, chainCount, chain } = this.state;
    return (
      <div className="home">
        <div className="home-top">
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="账号总数" value={accountCount} />
            </Col>
            <Col span={8} offset={8}>
              <Statistic title="币种总数" value={chainCount} precision={0} />
            </Col>
          </Row>
        </div>
        <Divider />
        {chain.length > 0 ? (
          <Tabs
            className="home-bottom"
            defaultActiveKey="0"
            onChange={this.callback}
          >
            {chain.map(function(item, index) {
              return (
                <TabPane tab={item.chainName} key={index}>
                  <Line chainId={item.id} />
                </TabPane>
              );
            })}
          </Tabs>
        ) : null}
      </div>
    );
  }
}

export default Home;
